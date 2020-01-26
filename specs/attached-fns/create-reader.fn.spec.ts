import { createReaderFn } from '../../src/attached-fns';
import { Types } from '../../src/constants';
import { FnFactorySpecs } from '../spec-helpers/shared-specs';

describe('createReaderFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createReaderFn, Types.ReaderFn);
});
