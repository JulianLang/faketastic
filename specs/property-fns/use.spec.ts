import { createArchitectFn } from '../../src/attached-fns';
import { isBuildable } from '../../src/buildable';
import { use } from '../../src/property-fns/use';

describe('use', () => {
  const mdl = {};

  it('should return a buildable', () => {
    // arrange, act
    const $model = use(mdl);

    // assert
    expect(isBuildable($model)).toBe(true);
  });

  it('should return a buildable containing a clone of the specified model', () => {
    // arrange, act
    const $model = use(mdl);

    // assert
    expect($model.value).not.toBe(mdl);
    expect($model.value).toEqual(mdl);
  });

  it('should add given attached functions', () => {
    // arrange
    const attachedFn = createArchitectFn(() => {});

    // act
    const $model = use(mdl, attachedFn);

    // assert
    expect($model.attachedFns).toEqual([attachedFn]);
  });
});
