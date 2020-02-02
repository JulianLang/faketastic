import { isReaderFn } from '../../../src/attached-fns';
import { Types } from '../../../src/constants';
import { TypeCheckFnSpecs } from '../../spec-helpers/shared-specs';

describe('isReaderFn', () => {
  TypeCheckFnSpecs.returnTrueForTypeMatches(isReaderFn, Types.ReaderFn);
  TypeCheckFnSpecs.returnFalseForNonMatches(isReaderFn);
  TypeCheckFnSpecs.returnFalseForValueWithoutType(isReaderFn);
  TypeCheckFnSpecs.returnFalseForNonDefined(isReaderFn);
});
