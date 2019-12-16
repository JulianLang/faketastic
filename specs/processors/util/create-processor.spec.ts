import { createProcessorFn, FnIsStickySymbol, getSymbol } from '../../../src';
import { testMutatingFnFactory } from '../../spec-helpers/shared-specs';

describe('createProcessor', () => {
  it('should set the FnIsStickySymbol if stickyness is set to "sticky"', () => {
    // arrange
    // act
    const procFn = createProcessorFn(() => {}, 'initializer', 42, 'sticky');

    // assert
    expect(getSymbol(FnIsStickySymbol, procFn)).toBe(true);
  });

  it('should not set the FnIsStickySymbol if stickyness is set to "unsticky"', () => {
    // arrange
    // act
    const procFn = createProcessorFn(() => {}, 'initializer', 42, 'unsticky');

    // assert
    expect(getSymbol(FnIsStickySymbol, procFn)).toBe(undefined);
  });

  testMutatingFnFactory(createProcessorFn, 'processor');
});
