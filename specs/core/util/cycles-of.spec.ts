import { cyclesOf } from '../../../src';

describe('cyclesOf', () => {
  it('should return previous cycles including the given one', () => {
    // arrange, act
    const startCycle = cyclesOf('initializer');
    const endCycle = cyclesOf('finalizer');

    // assert
    expect(startCycle).toEqual(['initializer']);
    expect(endCycle).toEqual(['initializer', 'preprocessor', 'postprocessor', 'finalizer']);
  });
});
