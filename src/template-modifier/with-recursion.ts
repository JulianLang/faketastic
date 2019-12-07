import { createBuildable, createBuilderFn, ProcessorFn, PureObject } from '../core';
import { clone } from '../util';

/**
 * Creates a recursive template object to be passed to `template` function.
 * @param tmpl The template to be made recursive.
 * @param property The property name that should hold the template recursion.
 * @param processors Processors that must include a `quantity(0, x)` or `canBe(any)` processor,
 * being able to end the recursion at some time. Otherwise you'll get a `StackOverflow` exception.
 */
export function withRecursion(
  tmpl: PureObject<any>,
  property: string,
  ...processors: ProcessorFn[]
) {
  // add recursive property on level 1
  (tmpl as any)[property] = recursiveProperty(property, tmpl, ...processors);

  return tmpl;

  /**
   * Creates a `Buildable` property making its holding template recursive.
   * @param property The property name being the recursion root
   * @param tmpl The template to be made recursive
   * @param processors Processors
   */
  function recursiveProperty<T>(property: string, tmpl: T, ...processors: ProcessorFn[]) {
    const builder = createBuilderFn(() => {
      let result = clone(tmpl);

      // add recursive property on deeper levels
      (result as any)[property] = recursiveProperty(property, tmpl, ...processors);

      return result;
    });

    return createBuildable(builder, processors);
  }
}
