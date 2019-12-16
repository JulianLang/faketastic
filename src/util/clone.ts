import { cloneDeep } from 'lodash';

export function clone<T>(value: T): T {
  return cloneDeep(value);
}
