import { build } from '../../core';
import { includeTemplateFnSpecs } from '../../core/built-in/specs/shared/shared-specs';
import { combine } from '../combine';

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
