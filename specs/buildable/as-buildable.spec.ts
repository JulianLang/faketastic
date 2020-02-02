import { asBuildable, createBuildable } from '../../src/buildable';
import { Type, Types } from '../../src/constants';

describe('asBuildable', () => {
  it('should return the original instance, if it is a Buildable', () => {
    // arrange
    const buildable = createBuildable(null);

    // act
    const result = asBuildable(buildable);

    // assert
    expect(result).toBe(buildable);
  });

  it('should wrap a value within a Buildable if the value is none', () => {
    // arrange
    const value = 42;

    // act
    const result = asBuildable(42);

    // assert
    expect(result[Type]).toBe(Types.Buildable);
    expect(result.value).toBe(value);
  });
});
