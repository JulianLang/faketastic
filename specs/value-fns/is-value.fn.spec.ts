import { Types } from '../../src/constants';
import { isValueFn } from '../../src/value-fns';
import { TypeCheckFnSpecs } from '../spec-helpers/shared-specs';

describe('isValueFn', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isValueFn, Types.ValueFn);
  TypeCheckFnSpecs.returnFalseForNonMatches(isValueFn);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isValueFn);
  TypeCheckFnSpecs.returnFalseForNonDefined(isValueFn);
});
