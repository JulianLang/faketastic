import { isBuildable } from './is-buildable';

export function unwrapIfBuildable(tmpl: any): any {
  let unwrappedValue = tmpl;

  while (isBuildable(unwrappedValue)) {
    unwrappedValue = unwrappedValue.value;
  }

  return unwrappedValue;
}
