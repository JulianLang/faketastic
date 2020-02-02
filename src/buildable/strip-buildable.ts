import { isBuildable } from './is-buildable';

export function stripBuildable(value: any): any {
  return isBuildable(value) ? value.value : value;
}
