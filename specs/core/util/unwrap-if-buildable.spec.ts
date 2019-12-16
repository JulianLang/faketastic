import { createBuildable, unwrapIfBuildable } from '../../../src';

describe('unwrapIfBuildable', () => {
  it('should return the given value if it is no buildable', () => {
    // arrange
    const value = {
      a: 42,
    };

    // act
    const unwrapped = unwrapIfBuildable(value);

    // assert
    expect(unwrapped).toBe(value);
  });

  it('should unwrap the given value until it is no buildable anymore', () => {
    // arrange
    const nested = createBuildable(42);
    const innerBuildable = createBuildable(nested);
    const value = createBuildable(innerBuildable);

    // act
    const unwrapped = unwrapIfBuildable(value);

    // assert
    expect(unwrapped).toBe(42);
  });

  it('should not unwrap values that just contain a buildable', () => {
    // arrange
    const nested = createBuildable(42);
    const value = {
      a: nested,
    };

    // act
    const unwrapped = unwrapIfBuildable(value);

    // assert
    expect(unwrapped).toBe(value);
  });
});
