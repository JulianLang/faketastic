import { isType } from '../../../src/util';
import { TypeCheckFnSpecs } from '../../spec-helpers/shared-specs';

const expectedType = 'my-custom-type';
const isTypeAdapter = (value: any) => isType(expectedType, value);

describe('isType', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isTypeAdapter, expectedType);
  TypeCheckFnSpecs.returnFalseForNonMatches(isTypeAdapter);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isTypeAdapter);
  TypeCheckFnSpecs.returnFalseForNonDefined(isTypeAdapter);
});
