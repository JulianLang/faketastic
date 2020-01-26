import { Types } from '../../src/constants';
import { createValueFn } from '../../src/value-fns';
import { FnFactorySpecs } from '../spec-helpers/shared-specs';

describe('createValueFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createValueFn, Types.ValueFn);
});
