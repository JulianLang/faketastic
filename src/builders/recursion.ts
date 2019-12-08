import { defaultRootName, ObjectTreeNode } from 'treelike';
import { ProcessorOrders } from '../constants';
import { asBuildable, Buildable, buildChild, createBuildable, createProcessorFn } from '../core';
import { placeholder } from '../placeholder';
import { AttachedFn } from '../types';
import { clone, isUndefined } from '../util';
import { IterationState, RecursionIterator } from './types/recursion';

/**
 * Creates a recursive template object to be passed to `template` function.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param attachedFns Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function recursion(
  property: string,
  endWhen: RecursionIterator,
  ...attachedFns: AttachedFn[]
) {
  const recursionInit = createProcessorFn(
    recursionImpl,
    'initializer',
    ProcessorOrders.recursion,
    // quantity will transfer this processor to the multiplied nodes
    'unsticky',
  );

  return createBuildable(placeholder(`recursion:${property}`), [recursionInit, ...attachedFns]);

  function recursionImpl(node: ObjectTreeNode) {
    const rootTemplateNode = tryFindRootTemplate(node);
    const tmpl = rootTemplateNode.value;
    const iteration = iterateNext(endWhen, tmpl);

    if (iteration.continue === true) {
      const buildableTmpl = asBuildable(tmpl);
      const clonedTmpl: Buildable = clone(buildableTmpl);
      clonedTmpl.value[property] = recursion(property, endWhen);

      node.value = buildChild(clonedTmpl, node);
    } else {
      node.value = iteration.endWithValue;
    }
  }

  function tryFindRootTemplate(node: ObjectTreeNode<any>) {
    if (isUndefined(node.parent)) {
      throw new Error(``);
    }

    let tmplNode: ObjectTreeNode = node.parent;

    while (tmplNode.name !== defaultRootName) {
      if (isUndefined(tmplNode.parent)) {
        throw new Error(`faketastic: recursion: Could not find valid root/template-node.`);
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
   * @param tmpl The template to pass in to the instructor function.
   */
  function iterateNext(iteratorFn: RecursionIterator, tmpl: any): IterationState {
    const value = iteratorFn(tmpl);
    const state = typeof value === 'function' ? value(tmpl) : value;

    return state;
  }
}
