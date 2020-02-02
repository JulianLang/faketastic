import { isBuildable } from '../../src/buildable';
import { model } from '../../src/property-fns';

describe('model', () => {
  it('should return a buildable', () => {
    // arrange
    const mdl = {};

    // act
    const $model = model(mdl);

    // assert
    expect(isBuildable($model)).toBe(true);
  });

  it('should return a buildable containing a clone of the specified model', () => {
    // arrange
    const mdl = {};

    // act
    const $model = model(mdl);

    // assert
    expect($model.value).not.toBe(mdl);
    expect($model.value).toEqual(mdl);
  });
});
