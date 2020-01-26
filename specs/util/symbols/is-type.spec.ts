import { isType } from '../../../src/util';
import { TypeCheckFnSpecs } from '../../spec-helpers/shared-specs';

describe('isType', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isType, 'some-type');
  TypeCheckFnSpecs.returnFalseForNonMatches(isType);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isType);
  TypeCheckFnSpecs.returnFalseForNonDefined(isType);
});
