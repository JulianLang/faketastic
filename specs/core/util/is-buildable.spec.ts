import { BuildableSymbol, createBuildable, isBuildable } from '../../../src/core';

describe('isBuildable', () => {
  it('should return true if the buildable symbol is present, false otherwise', () => {
    // arrange, act, assert
    expect(isBuildable({ [BuildableSymbol]: true })).toBe(true);
    expect(isBuildable(createBuildable({}))).toBe(true);

    expect(isBuildable('str')).toBe(false);
    expect(isBuildable(42)).toBe(false);
    expect(isBuildable(true)).toBe(false);
    expect(isBuildable({})).toBe(false);
    expect(isBuildable([])).toBe(false);
    expect(
      isBuildable({
        architects: [],
        processors: [],
        treeReaders: [],
        value: null,
      }),
    ).toBe(false);
  });
});
