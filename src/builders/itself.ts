import { ObjectTreeNode } from 'treelike';
import { MutatingFnOrders, UnsetValue } from '../constants';
import {
  asBuildable,
  Buildable,
  createBuildable,
  isBuildable,
  markFnCalled,
  rebuild,
} from '../core';
import { createProcessorFn } from '../processors';
import { createTreeReaderFn } from '../tree-reader';
import { AttachedFn } from '../types';
import { clone, findAnchestor, isUndefined, setSymbol } from '../util';
import { CouldNotFindRootTemplateError } from './errors';
import { RecursionController, RecursionState } from './types/recursion';

export const RecursionRootSymbol = Symbol('faketastic.recursion.root');

/**
 * Creates a recursive property, recursing the template it lays on.
 * @param tmpl The template to be made recursive.
 * @param attachedFns ArchitectFns or ProcessorFns to be applied to the recursive property.
 */
export function itself(endWhen: RecursionController, ...attachedFns: AttachedFn[]): Buildable {
  let property = 'unknown';
  let originalTemplate: ObjectTreeNode<Buildable>;
  let state: RecursionState;

  const takeTemplateSnapshot = createTreeReaderFn(snapshotOriginalTemplate, 'initializer');
  const recurseNext = createProcessorFn(
    recurseNextImpl,
    'initializer',
    // quantity will transfer this processor to multiplied nodes
    'unsticky',
    MutatingFnOrders.processors.recursion,
  );
  const endRecursion = createProcessorFn(
    endRecursionImpl,
    'initializer',
    // quantity will keep this processor on initial node
    'sticky',
    MutatingFnOrders.processors.recursion,
  );

  return createBuildable(UnsetValue, [
    takeTemplateSnapshot,
    endRecursion,
    recurseNext,
    ...attachedFns,
  ]);

  /**
   * Makes a snapshot of the parent-template the node lays in.
   * @param node The node the snapshot is initialized from.
   */
  function snapshotOriginalTemplate(node: ObjectTreeNode) {
    if (isUndefined(node.parent)) {
      throw new Error(CouldNotFindRootTemplateError);
    }

    const rootTmpl = node.parent;

    if (isBuildable(rootTmpl.value)) {
      originalTemplate = clone(rootTmpl);
      property = node.name.toString();

      if (!findAnchestor(RecursionRootSymbol, node.parent, property)) {
        setSymbol(RecursionRootSymbol, rootTmpl, property);
      }
    } else {
      throw new Error(CouldNotFindRootTemplateError);
    }

    markFnCalled(snapshotOriginalTemplate, node);
  }

  /**
   * Continues the recursion on the child-node(s).
   * @param node The node holding the next recursion iteration.
   */
  function recurseNextImpl(node: ObjectTreeNode): void {
    if (!state.continue) {
      return;
    }

    const tmpl = originalTemplate.value;
    const buildableTmpl = asBuildable(tmpl);

    const clonedTmpl: Buildable = clone(buildableTmpl);
    clonedTmpl.value[property] = itself(endWhen, ...attachedFns);

    node.children = [];
    node.value = clonedTmpl;

    markFnCalled(recurseNextImpl, node);
    rebuild(node, 'initializer');
  }

  /**
   * Ends the recursion with a static value; so recursion is completed.
   * @param node The node on which the recursion takes place.
   */
  function endRecursionImpl(node: ObjectTreeNode): void {
    state = checkState(endWhen, node);

    if (!state.continue) {
      node.children = [];
      node.value = state.endWithValue;
    }

    markFnCalled(endRecursion, node);
  }

  /**
   * Gets the recursion state for the current iteration. This state controls when to stop the recursion
   * and with what value.
   * @param controllerFn The recursion instructor function controlling when the recursion should stop
   * and with value the recursion should stop. Recursion instructor functions avoid inifinite loops.
   * @param node The template to pass in to the instructor function.
   */
  function checkState(controllerFn: RecursionController, node: ObjectTreeNode): RecursionState {
    const stateOrControllerFn = controllerFn(node);
    const state =
      typeof stateOrControllerFn === 'function' ? stateOrControllerFn(node) : stateOrControllerFn;

    return state;
  }
}
