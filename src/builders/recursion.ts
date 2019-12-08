import { addChild, ObjectTreeNode, treeOf } from 'treelike';
import { ProcessorOrders } from '../constants';
import {
  asBuildable,
  childSelector,
  createBuildable,
  createProcessorFn,
  ProcessorFn,
} from '../core';
import { placeholder } from '../placeholder';
import { clone, isUndefined } from '../util';
import { IterationState, RecursionIterator } from './types/recursion';

/**
 * Creates a recursive template object to be passed to `template` function.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param processors Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function recursion(
  property: string,
  endWhen: RecursionIterator,
  ...processors: ProcessorFn[]
) {
  const recursionInit = createProcessorFn(recursionImpl, 'initializer', ProcessorOrders.recursion);

  return createBuildable(placeholder(`recursion:${property}`), [recursionInit, ...processors]);

  function recursionImpl(node: ObjectTreeNode) {
    if (isUndefined(node.parent)) {
      throw new Error(``);
    }

    const tmpl = node.parent.value;
    const buildableTmpl = asBuildable(tmpl);
    const clonedTmpl = clone(buildableTmpl);
    const iteration = iterateNext(endWhen, clonedTmpl.value);

    if (iteration.continue === true) {
      const childTree = treeOf(clonedTmpl, childSelector, node);
      addChild(childTree, node);
      console.log(node);
    } else {
      node.value = iteration.endWithValue;
    }
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
