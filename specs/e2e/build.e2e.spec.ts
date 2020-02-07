import { quantity } from '../../src/attached-fns';
import { createBuildable } from '../../src/buildable';
import { build } from '../../src/builder';
import { createValueFn } from '../../src/value-fns';

describe('e2e: build', () => {
  it('should build properties having a ValueFn', () => {
    // arrange
    const expectedValue = 'Pete';
    const valueFn = createValueFn(() => expectedValue);

    // act
    const result = build({ property: valueFn });

    // assert
    expect(result.property).toBe(expectedValue);
  });
});

describe('e2e: build and quantity', () => {
  it('should accept quantity returning pure array value', () => {
    // arrange
    const buildable = createBuildable(null, [quantity(2)]);

    // act
    const result = build(buildable);

    // assert
    expect(result).toEqual([null, null]);
  });
});
