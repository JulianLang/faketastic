import { isBuildable } from '../../src/buildable';
import { Types } from '../../src/constants';
import { TypeCheckFnSpecs } from '../spec-helpers/shared-specs';

describe('isBuildable', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isBuildable, Types.Buildable);
  TypeCheckFnSpecs.returnFalseForNonMatches(isBuildable);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isBuildable);
  TypeCheckFnSpecs.returnFalseForNonDefined(isBuildable);
});
