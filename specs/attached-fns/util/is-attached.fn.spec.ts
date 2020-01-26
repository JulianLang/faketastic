import { isAttachedFn } from '../../../src/attached-fns';
import { Types } from '../../../src/constants';
import { TypeCheckFnSpecs } from '../../spec-helpers/shared-specs';

describe('isAttachedFn', () => {
  const validTypes = [Types.ArchitectFn, Types.ProcessorFn, Types.ReaderFn];

  validTypes.forEach(type => TypeCheckFnSpecs.returnTrueForTypeMatches(isAttachedFn, type));
  TypeCheckFnSpecs.returnFalseForNonMatches(isAttachedFn);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isAttachedFn);
  TypeCheckFnSpecs.returnFalseForNonDefined(isAttachedFn);
});
