import { build } from '../../core';
import { includeStatementFnSpecs } from '../../core/built-in/specs/shared/shared-specs';
import { combine } from '../combine';

describe('combine statement function', () => {
  it('should return a buildable with the given properties as value', () => {
    // arrange
    const template = { a: 1, b: false, c: 'str' };
    const mapFn = () => {};

    // act
    const buildable = combine(template, mapFn);

    // assert
    expect(buildable.value).toBe(template);
  });

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

  includeStatementFnSpecs(combine, {}, () => {});
});
