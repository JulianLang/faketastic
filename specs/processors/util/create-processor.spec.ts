import { createProcessorFn, FnIsStickySymbol, getSymbol } from '../../../src';
import { testMutatingFnFactory } from '../../spec-helpers/shared-specs';

describe('createProcessor', () => {
  it('should set the FnIsStickySymbol if stickyness is set to "sticky"', () => {
    // arrange
    // act
    const procFn = createProcessorFn(() => {}, 'initializer', 'sticky', 42);

    // assert
    expect(getSymbol(FnIsStickySymbol, procFn)).toBe(true);
  });

  it('should not set the FnIsStickySymbol if stickyness is set to "unsticky"', () => {
    // arrange
    // act
    const procFn = createProcessorFn(() => {}, 'initializer', 'unsticky', 42);

    // assert
    expect(getSymbol(FnIsStickySymbol, procFn)).toBe(undefined);
  });

  testMutatingFnFactory(
    (fn, cycle, orderNumber) => createProcessorFn(fn, cycle, 'unsticky', orderNumber),
    'processor',
  );
});
