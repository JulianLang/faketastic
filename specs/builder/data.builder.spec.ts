import { buildData } from '../../src/builder';
import { createValueFn } from '../../src/value-fns';

describe('buildData', () => {
  it('should build properties having a ValueFn', () => {
    // arrange
    const expectedValue = 'Pete';
    const valueFn = createValueFn(() => expectedValue);

    // act
    const result = buildData({ property: valueFn });

    // assert
    expect(result.property).toBe(expectedValue);
  });
});
