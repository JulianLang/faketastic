import { createBuildable, createBuilderFn, ProcessorFn, PureObject } from '../core';
import { clone } from '../util';
import { RecursionInstruction, RecursionInstructorFn } from './types';

/**
 * Creates a recursive template object to be passed to `template` function.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param processors Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function withRecursion<T>(
  tmpl: PureObject<T>,
  property: string,
  endWhen: RecursionInstructorFn,
  ...processors: ProcessorFn[]
) {
  const instruction = getRecursionInstruction(endWhen, tmpl);

  if (instruction.continue) {
    (tmpl as any)[property] = addRecursiveProperty(endWhen, tmpl);
  } else {
    (tmpl as any)[property] = instruction.endWithValue;
  }

  return tmpl;

  /**
   * Creates a `Buildable` property making its holding template recursive.
   * @param property The property name being the recursion root
   * @param tmpl The template to be made recursive
   * @param processors Processors
   */
  function addRecursiveProperty(endWhen: RecursionInstructorFn, tmpl: T) {
    const instruction = getRecursionInstruction(endWhen, tmpl);

    const builder = createBuilderFn(() => {
      let result = clone(tmpl);

      if (instruction.continue === true) {
        (result as any)[property] = addRecursiveProperty(endWhen, tmpl);
      } else {
        (result as any)[property] = instruction.endWithValue;
      }

      return result;
    });

    return createBuildable(builder, processors);
  }

  /**
   * Gets the recursion instruction for the current recursion iteration. This instruction controls when
   * to stop the recursion and with what value.
   * @param instructorFn The recursion instructor function controlling when the recursion should stop
   * and with value the recursion should stop. Recursion instructor functions avoid inifinite loops.
   * @param tmpl The template to pass in to the instructor function.
   */
  function getRecursionInstruction(
    instructorFn: RecursionInstructorFn,
    tmpl: T,
  ): RecursionInstruction {
    const value = instructorFn(tmpl);
    const result = typeof value === 'function' ? value(tmpl) : value;

    return result;
  }
}
