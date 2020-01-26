import { iterate } from 'treelike';
import { isBuildable } from './is-buildable';

/**
 * Determines whether a given value contains at least one `Buildable`. Checks also for nested
 * values when an object or array was given as input.
 * @param value The value to check if it contains at least one `Buildable`.
 * @returns `true` if the given value contains at least one `Buildable`, `false` otherwise.
 */
export function containsBuildable(value: any): boolean {
  if (isStaticValue(value)) {
    return false;
  } else if (isBuildable(value)) {
    return true;
  }

  let result = false;

  iterate(value, child => {
    if (containsBuildable(child)) {
      result = true;
    }
  });

  return result;
}

/**
 * Determines whether a given value is a static value.
 * @param value The value to check if it is static.
 */
function isStaticValue(value: any): boolean {
  switch (typeof value) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'function':
    case 'bigint':
    case 'symbol':
      return true;
  }

  return false;
}
