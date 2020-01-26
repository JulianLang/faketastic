import { createBuildable } from '../../src/buildable';
import { build } from '../../src/builder';
import { createValueFn } from '../../src/value-fns';

describe('build', () => {
  it('should build properties having a ValueFn', () => {
    // arrange
    const expectedValue = 'Pete';
    const valueFn = createValueFn(() => expectedValue);

    // act
    const result = build({ property: valueFn });

    // assert
    expect(result.property).toBe(expectedValue);
  });

  it('should assign properties having static values', () => {
    // arrange
    const staticValuesOnly = {
      string: '',
      number: 0,
      bool: false,
      fn: () => {},
      object: { number: 0 },
      array: [0, ''],
    };

    // act
    const result = build(staticValuesOnly);

    // assert
    expect(result.string).toBe('');
    expect(result.number).toBe(0);
    expect(result.bool).toBe(false);
    expect(result.fn).toBe(staticValuesOnly.fn);
    expect(result.object).toEqual({ number: 0 });
    expect(result.array).toEqual([0, '']);
  });

  // TODO: langju: maybe merge nested buildables into one, allowing kind of "containerization"
  it('should extract values from nested buildables', () => {
    // arrange
    const expectedValue = 0;
    const nestedLevel2 = createBuildable(expectedValue);
    const nestedLevel1 = createBuildable(nestedLevel2);
    const buildable = createBuildable(nestedLevel1);

    // act
    const result = build(buildable);

    // assert
    expect(result).toBe(expectedValue);
  });

  it('should eagerly/recursively build properties', () => {
    // arrange
    const expectedValue = 0;
    const nestedBuildable = createBuildable(expectedValue);
    const valueFn = createValueFn(() => nestedBuildable);
    const buildable = createBuildable(valueFn);

    // act
    const result = build(buildable);

    // assert
    expect(result).toBe(0);
  });
});
