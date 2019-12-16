import { createArchitectFn } from '../../../src';
import { testMutatingFnFactory } from '../../spec-helpers/shared-specs';

describe('createArchitectFn', () => {
  testMutatingFnFactory(createArchitectFn, 'architect');
});
