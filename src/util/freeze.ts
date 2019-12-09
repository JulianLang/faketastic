// TODO: langju: To be tested!
/**
 * Recursively freezes a given value and returns the immutable result.
 * @param value The value to be frozen / made immutable.
 */
export function freeze(value: Object): any {
  Object.freeze(value);
  if (value === undefined) {
    return value;
  }

  Object.getOwnPropertyNames(value).forEach(function(prop) {
    if (
      (value as any)[prop] !== null &&
      (typeof (value as any)[prop] === 'object' || typeof (value as any)[prop] === 'function') &&
      !Object.isFrozen((value as any)[prop])
    ) {
      freeze((value as any)[prop]);
    }
  });

  return value;
}
