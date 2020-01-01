import { combine, oneOf, ref } from '../../src/builders';
import { build, model } from '../../src/core';
import { includeBuilderFnSpecs, includeDirectiveFnSpecs } from '../spec-helpers/shared-specs';

describe('ref', () => {
  // TODO: langju: add test case for resolving reference sitting in childtree

  it('should not reference matching placeholder nodes', () => {
    // arrange
    const expectedValue = 42;
    const tmpl = model({
      age: oneOf([expectedValue]),
      b: combine(
        {
          // the ref's name matches its target, but should be ignored:
          age: ref('age'),
        },
        values => values.age,
      ),
    });

    // act
    const built = build(tmpl);

    // assert
    expect(built).toBeDefined();
    expect(built.b).toEqual(expectedValue);
  });

  it('should resolve references being located on a grandparent', () => {
    // arrange
    const expectedValue = 42;
    const tmpl = model({
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
    const buildable = model({
      a: expectedValue,
      b: ref('a'),
    });

    // act
    const result = build(buildable);

    // assert
    expect(result.b).toEqual(expectedValue);
  });

  includeDirectiveFnSpecs(ref, 'propName');
  includeBuilderFnSpecs(ref, 'propName');
});
