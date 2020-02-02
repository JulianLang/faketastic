import { Types } from '../../src/constants';
import { isFaketasticNode } from '../../src/util';
import { TypeCheckFnSpecs } from '../spec-helpers/shared-specs';

describe('isFaketasticNode', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isFaketasticNode, Types.FaketasticNode);
  TypeCheckFnSpecs.returnFalseForNonMatches(isFaketasticNode);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isFaketasticNode);
  TypeCheckFnSpecs.returnFalseForNonDefined(isFaketasticNode);
});
