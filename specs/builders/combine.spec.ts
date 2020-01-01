import { combine, ref } from '../../src/builders';
import { build, model } from '../../src/core';
import { Func } from '../../src/types';
import { includeBuilderFnSpecs, includeTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('combine', () => {
  it('should call the map function', () => {
    // arrange
    const template = { a: 1, b: false, c: 'str' };
    const mapFn: Func<any[], any> = (v: any) => v;
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
    const tmpl = model({
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
  includeBuilderFnSpecs(combine, {}, () => {});
});
