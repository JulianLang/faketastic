import { build, createBuildable } from '../../src/core';
import { canBe } from '../../src/processors/can-be';
import { includeProcessorFnSpecs } from './shared/shared-specs';

describe('canBe processor function', () => {
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

  includeProcessorFnSpecs(canBe, 'any value');
});
