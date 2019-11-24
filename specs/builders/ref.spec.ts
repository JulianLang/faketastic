import { ref } from '../../src/builders';
import { build, template } from '../../src/core';
import { includeDirectiveFnSpecs } from '../spec-helpers/shared-specs';

describe('ref builder function', () => {
  it('should resolve an existing reference', () => {
    // arrange
    const expectedValue = 'hello!';
    const buildable = template({
      a: expectedValue,
      b: ref('a'),
    });

    // act
    const result = build(buildable);

    // assert
    expect(result.b).toEqual(expectedValue);
  });

  it('should warn the user if a reference could not be resolved', () => {
    // arrange
    spyOn(console, 'warn');
    const buildable = template({
      b: ref('not-existing'),
    });

    // act
    build(buildable);

    // assert
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  includeDirectiveFnSpecs(ref, 'propName');
});
