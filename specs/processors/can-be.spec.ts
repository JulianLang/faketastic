import { build, createBuildable } from '../../src/core';
import { canBe } from '../../src/processors/can-be';
import { includeAttachedFnSpecs } from '../spec-helpers/shared-specs';

describe('canBe', () => {
  it('should replace the value of a node with the specified one', () => {
    // arrange
    const expectedValue = 42;
    // likelyhood = 1 -> will always replace:
    const canBeProcessor = canBe(expectedValue, 1);
    const buildable = createBuildable({}, [canBeProcessor]);

    // act
    const built = build(buildable);

    // assert
    expect(built).toEqual(expectedValue);
  });

  it('should not run when likelyhood is 0', () => {
    // arrange
    const canBeProcessor = canBe('any', 0);
    const template = 42;
    const buildable = createBuildable(template, [canBeProcessor]);

    // act
    const built = build(buildable);

    // assert
    expect(built).toEqual(template);
  });

  includeAttachedFnSpecs('canBe', 'processor', canBe, 'any value');
});
