import { build } from '../../core';
import { createBuildable } from '../../core/built-in/specs/shared/spec.helper';
import { map } from '../map';
import { includeProcessorFnSpecs } from './shared/shared-specs';

describe('map processor fn', () => {
  it('should call the mapFn with the buildable it is located on', () => {
    // arrange
    const mapFn = jasmine.createSpy('mapFn', v => v).and.callThrough();
    const value = 42;
    const mapProcessor = map(mapFn);
    const buildable = createBuildable(value, [mapProcessor]);

    // act
    build(buildable);

    // assert
    expect(mapFn).toHaveBeenCalledTimes(1);
    expect(mapFn).toHaveBeenCalledWith(buildable);
  });

  it('should write the mapped value onto the node as value', () => {
    // arrange
    const expectedValue = 4711;
    const value = 42;
    const mapProcessor = map(_ => expectedValue);
    const buildable = createBuildable(value, [mapProcessor]);

    // act
    const result = build(buildable);

    // assert
    expect(result).toEqual(expectedValue);
  });

  includeProcessorFnSpecs(map, () => {});
});
