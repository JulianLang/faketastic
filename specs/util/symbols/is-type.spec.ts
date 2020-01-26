import { isType } from '../../../src/util';
import { UtilSpecs } from '../../spec-helpers/shared-specs';

describe('isType', () => {
  UtilSpecs.Symbols.Type.returnTrueForTypeMatches(isType);
  UtilSpecs.Symbols.Type.returnFalseForNonMatches(isType);
  UtilSpecs.Symbols.Type.returnFalseForValueWithoutType(isType);
  UtilSpecs.Symbols.Type.returnFalseForNonDefined(isType);
});
