import { Buildable, createBuildable } from '../buildable';

/**
 * Creates a new model by extending the given base model. The extension's properties might add new
 * properties or override properties that already exists in the base model.
 *
 * ~~~ts
 * const $pet = model({
 *  name: oneOf(PetNames),
 *  age: range(1, 12),
 * });
 * const $turtle = extends($pet, {
 *  isHybernating: bool(),
 *  age: range(1, 100),
 * });
 * ~~~
 * @param base The base model to be extended.
 * @param extension The extension model, able to extend and override base-properties.
 */
export function extend<T, K>(base: T, extension: K): Buildable<T & K> {
  const extended = createBuildable({
    ...base,
    ...extension,
  });

  return extended;
}
