import { createArchitectFn } from '../../../src/attached-fns';
import { Types } from '../../../src/constants';
import { FnFactorySpecs } from '../../spec-helpers/shared-specs';

describe('createArchitectFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createArchitectFn, Types.ArchitectFn);
});
