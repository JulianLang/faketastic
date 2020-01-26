import { isArchitectFn } from '../../../src/attached-fns';
import { Types } from '../../../src/constants';
import { TypeCheckFnSpecs } from '../../spec-helpers/shared-specs';

describe('isArchitectFn', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isArchitectFn, Types.ArchitectFn);
  TypeCheckFnSpecs.returnFalseForNonMatches(isArchitectFn);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isArchitectFn);
  TypeCheckFnSpecs.returnFalseForNonDefined(isArchitectFn);
});
