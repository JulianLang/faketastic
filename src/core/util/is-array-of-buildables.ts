import { isDefined } from '../../util';
import { Buildable } from '../types';
import { isBuildable } from './is-buildable';

export function isArrayOfBuildables(value: any): value is Buildable[] {
  if (!isDefined(value) || !Array.isArray(value)) {
    return false;
  }

  return value.length > 0 && value.every(v => isBuildable(v));
}
