import { quantity } from '../../src/attached-fns';
import { createBuildable } from '../../src/buildable';
import { build } from '../../src/builder';

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
