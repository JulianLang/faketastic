import { combine } from '../../src/builders';
import { build } from '../../src/core';
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

  includeTemplateFnSpecs(combine, {}, () => {});
});
