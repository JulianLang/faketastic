import { BuildCycle, compareCycles } from '../../../src/core';

describe('compareCycles', () => {
  it('should return true for >, if a buildcycle runs later than the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'tree-building';

    // act
    const result = compareCycles(a, '>', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for >=, if a buildcycle runs later than the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'tree-building';

    // act
    const result = compareCycles(a, '>=', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for >=, if a buildcycle runs same time as the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'preprocessor';

    // act
    const result = compareCycles(a, '>=', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for <, if a buildcycle runs earlier than the other', () => {
    // arrange
    const a: BuildCycle = 'tree-building';
    const b: BuildCycle = 'preprocessor';

    // act
    const result = compareCycles(a, '<', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for <, if a buildcycle runs earlier than the other', () => {
    // arrange
    const a: BuildCycle = 'tree-building';
    const b: BuildCycle = 'preprocessor';

    // act
    const result = compareCycles(a, '<=', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for <, if a buildcycle runs same time as the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'preprocessor';

    // act
    const result = compareCycles(a, '<=', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return true for ==, if a buildcycle runs same time as the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'preprocessor';

    // act
    const result = compareCycles(a, '==', b);

    // assert
    expect(result).toBe(true);
  });

  it('should return false for ==, if a buildcycle runs not same time as the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'tree-building';

    // act
    const result = compareCycles(a, '==', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for <, if a buildcycle runs later than the other', () => {
    // arrange
    const a: BuildCycle = 'postprocessor';
    const b: BuildCycle = 'tree-building';

    // act
    const result = compareCycles(a, '<', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for <, if a buildcycle runs same as the other', () => {
    // arrange
    const a: BuildCycle = 'postprocessor';
    const b: BuildCycle = 'postprocessor';

    // act
    const result = compareCycles(a, '<', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for <=, if a buildcycle runs later than the other', () => {
    // arrange
    const a: BuildCycle = 'postprocessor';
    const b: BuildCycle = 'tree-building';

    // act
    const result = compareCycles(a, '<=', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for >, if a buildcycle runs earlier than the other', () => {
    // arrange
    const a: BuildCycle = 'preprocessor';
    const b: BuildCycle = 'finalizer';

    // act
    const result = compareCycles(a, '>', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for >, if a buildcycle runs same time as the other', () => {
    // arrange
    const a: BuildCycle = 'finalizer';
    const b: BuildCycle = 'finalizer';

    // act
    const result = compareCycles(a, '>', b);

    // assert
    expect(result).toBe(false);
  });

  it('should return false for >=, if a buildcycle runs ealier than the other', () => {
    // arrange
    const a: BuildCycle = 'postprocessor';
    const b: BuildCycle = 'finalizer';

    // act
    const result = compareCycles(a, '>=', b);

    // assert
    expect(result).toBe(false);
  });
});
