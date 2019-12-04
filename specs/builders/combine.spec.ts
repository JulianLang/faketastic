import { combine, ref } from '../../src/builders';
import { build, template } from '../../src/core';
import { includeTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('combine template function', () => {
  it('should call the map function', () => {
    // arrange
    const template = { a: 1, b: false, c: 'str' };
    const mapFn = (..._: any[]) => {};
    const spy = jasmine.createSpy('mapFnSpy', mapFn);
    const buildable = combine(template, spy);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledWith(template);
  });

  it('should connect the buildable to the rest of the tree', () => {
    // arrange
    const expectedValue = 42;
    const tmpl = template({
      a: expectedValue,
      b: combine(
        {
          b: ref('a'),
        },
        values => values.b,
      ),
    });

    // act
    const built = build(tmpl);

    // assert
    expect(built).toBeDefined();
    expect(built.b).toEqual(expectedValue);
  });

  includeTemplateFnSpecs(combine, {}, () => {});
});
