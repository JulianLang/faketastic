import { isBuildable } from '../../buildable';

/**
 * Selects (sub-)properties of objects or arrays while directly diving into `Buildable.value`,
 * leaving out the `Buildable`-"shell" for all `Buildable`-properties.
 * @param input The read value that gets converted to ObjectTreeNode
 */
export function childSelector(input: any): any {
  let value = input;

  // dive into Buildable.value
  while (isBuildable(value)) {
    value = value.value;
  }

  return value;
}
