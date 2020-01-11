import { cyclesOf } from '../../../src';

describe('cyclesOf', () => {
  it('should return previous cycles including the given one', () => {
    // arrange, act
    const startCycle = cyclesOf('tree-building');
    const endCycle = cyclesOf('finalizer');

    // assert
    expect(startCycle).toEqual(['tree-building']);
    expect(endCycle).toEqual(['tree-building', 'preprocessor', 'postprocessor', 'finalizer']);
  });
});
