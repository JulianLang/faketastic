import { cloneDeep } from 'lodash';

export function clone(value: any): any {
  return cloneDeep(value);
}
