import { createBuildable } from '../../../src/buildable';
import { childSelector } from '../../../src/builder/traverser';

describe('childSelector', () => {
  it('should pass-back non-buildable values', () => {
    // arrange
    const nonBuildables = [
      null,
      undefined,
      42,
      'str',
      false,
      true,
      () => {},
      {},
      [],
      Symbol('test-symbol'),
    ];

    // act, assert
    nonBuildables.forEach(value => {
      expect(childSelector(value)).toBe(value);
    });
  });

  it('should pass-back the value of a Buildable, if the input is a Buildable', () => {
    // arrange
    const buildable = createBuildable(42);

    // act, assert
    expect(childSelector(buildable)).toBe(42);
  });

  it('should pass-back the value of the leaf-Buildable, if the input are nested Buildables', () => {
    // arrange
    const nestedLevel1 = createBuildable(42);
    const nestedLevel2 = createBuildable(nestedLevel1);
    const buildable = createBuildable(nestedLevel2);

    // act, assert
    expect(childSelector(buildable)).toBe(42);
  });
});
