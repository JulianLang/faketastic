import { createTreeReaderFn } from '../../src';
import { testAttachedFnFactory } from '../spec-helpers/shared-specs';

describe('createTreeReaderFn', () => {
  testAttachedFnFactory(createTreeReaderFn, 'tree-reader');
});
