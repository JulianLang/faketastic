import { oneOf, ref } from '../../src/builders';
import { build, template } from '../../src/core';
import { includeDirectiveFnSpecs } from '../spec-helpers/shared-specs';

describe('ref builder function', () => {
  it('should resolve references being located on a grandparent', () => {
    // arrange
    const expectedValue = 42;
    const tmpl = template({
      a: oneOf([expectedValue]),
      b: {
        c: {
          d: ref('a'),
        },
      },
    });

    // act
    const built = build(tmpl);

    // assert
    expect(built).toBeDefined();
    expect(built.b).toBeDefined();
    expect(built.b.c).toBeDefined();
    expect(built.b.c.d).toEqual(expectedValue);
  });

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
