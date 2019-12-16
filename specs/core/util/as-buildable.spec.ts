import { asBuildable, createBuildable } from '../../../src/core';

describe('asBuildable', () => {
  it('should return a brand-new buildable if the value is none', () => {
    // arrange
    const obj = {
      a: 42,
      b: () => {},
    };

    // act
    const buildable = asBuildable(obj);

    // assert
    expect(buildable.value).toBe(obj);
    expect(buildable.treeReaders).toEqual([]);
    expect(buildable.architects).toEqual([]);
    expect(buildable.processors).toEqual([]);
  });

  it('should return the original buildable if the value is one', () => {
    // arrange
    const originalBuildable = createBuildable({
      a: 42,
      b: () => {},
    });

    // act
    const buildable = asBuildable(originalBuildable);

    // assert
    expect(buildable).toBe(originalBuildable);
  });
});
