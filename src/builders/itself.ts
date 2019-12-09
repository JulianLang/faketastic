import { defaultRootName, ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  asBuildable,
  Buildable,
  buildChild,
  createBuildable,
  createProcessorFn,
  isBuildable,
} from '../core';
import { placeholder } from '../placeholder';
import { createTreeReaderFn } from '../tree-reader';
import { AttachedFn } from '../types';
import { clone, isUndefined } from '../util';
import { CouldNotFindRootTemplateError } from './errors';
import { RecursionController, RecursionState } from './types/recursion';

/**
 * Creates a recursive property, recursing the template it lays on.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param attachedFns Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function itself(endWhen: RecursionController, ...attachedFns: AttachedFn[]) {
  let property = 'unknown';
  let originalTemplate: ObjectTreeNode<Buildable>;
  let state: RecursionState;

  const takeTemplateSnapshot = createTreeReaderFn(snapshotOriginalTemplate, 'initializer');
  const recurseNext = createProcessorFn(
    recurseNextImpl,
    'initializer',
    ProcessorOrders.recursion,
    // quantity will transfer this processor to multiplied nodes
    'unsticky',
  );
  const endRecursion = createProcessorFn(
    endRecursionImpl,
    'initializer',
    ProcessorOrders.recursion,
  );

  return createBuildable(placeholder(`recursion`), [
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
      throw CouldNotFindRootTemplateError;
    }

    const rootTmpl = tryFindRootTemplate(node);

    if (isBuildable(rootTmpl.value)) {
      originalTemplate = clone(rootTmpl);
      property = node.name.toString();
    } else {
      throw CouldNotFindRootTemplateError;
    }
  }

  /**
   * Continues the recursion on the child-node(s).
   * @param node The node holding the next recursion iteration.
   */
  function recurseNextImpl(node: ObjectTreeNode): void {
    const tmpl = originalTemplate.value;
    const buildableTmpl = asBuildable(tmpl);

    const clonedTmpl: Buildable = clone(buildableTmpl);
    clonedTmpl.value[property] = itself(endWhen, ...attachedFns);

    node.children = [];
    node.value = buildChild(clonedTmpl, node);
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
      // removeAttachedFn(recurseNextImpl, )
    }
  }

  function tryFindRootTemplate(node: ObjectTreeNode<any>) {
    // node.parent is ensured by preceeding function
    let tmplNode: ObjectTreeNode = node.parent!;

    while (tmplNode.name !== defaultRootName) {
      if (isUndefined(tmplNode.parent)) {
        throw CouldNotFindRootTemplateError;
      }

      tmplNode = tmplNode.parent;
    }
    return tmplNode;
  }

  /**
   * Gets the recursion instruction for the current recursion iteration. This instruction controls when
   * to stop the recursion and with what value.
   * @param iteratorFn The recursion instructor function controlling when the recursion should stop
   * and with value the recursion should stop. Recursion instructor functions avoid inifinite loops.
   * @param node The template to pass in to the instructor function.
   */
  function checkState(iteratorFn: RecursionController, node: ObjectTreeNode): RecursionState {
    const value = iteratorFn(node);
    const state = typeof value === 'function' ? value(node) : value;

    return state;
  }
}
