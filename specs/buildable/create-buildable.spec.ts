import { createBuildable } from '../../src/buildable';
import { DefaultConfig, Type, Types } from '../../src/constants';
import { getSymbol } from '../../src/util';

describe('createBuildable', () => {
  it(`should have the type "${Types.Buildable}"`, () => {
    // arrange, act
    const buildable = createBuildable(null);

    // assert
    const type = getSymbol(Type, buildable);
    expect(type).toBe(Types.Buildable);
  });

  it('should include faketastics default config', () => {
    // arrange
    // act
    const buildable = createBuildable(null);

    // assert
    expect(buildable.attachedProperties).toEqual(DefaultConfig);
    expect(buildable.attachedProperties).not.toBe(DefaultConfig);
  });
});
