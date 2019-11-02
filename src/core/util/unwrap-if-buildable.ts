import { isBuildable } from './type.helper';

export function unwrapIfBuildable(tmpl: any): any {
  let unwrappedValue = tmpl;

  while (isBuildable(unwrappedValue)) {
    unwrappedValue = unwrappedValue.value;
  }

  return unwrappedValue;
}
