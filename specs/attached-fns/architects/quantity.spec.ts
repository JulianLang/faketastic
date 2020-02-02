import { createArchitectFn, createProcessorFn, quantity } from '../../../src/attached-fns';
import { Buildable, createBuildable, isBuildable } from '../../../src/buildable';
import { isArray } from '../../../src/util';

fdescribe('quantity', () => {
  it('should accept static number of items', () => {
    // arrange
    const n = 2;
    const architectFn = quantity(n);

    // act
    const result = architectFn(null);

    // assert
    expect(result).toEqual([null, null]);
  });

  it('should accept computed number of items', () => {
    // arrange
    const n = () => 2;
    const architectFn = quantity(n);

    // act
    const result = architectFn(null);

    // assert
    expect(result).toEqual([null, null]);
  });

  it('should return an array even for quantity n=1', () => {
    // arrange
    const architectFn = quantity(1);

    // act
    const result = architectFn(null);

    // assert
    expect(isArray(result)).toBe(true);
  });

  [
    createArchitectFn(() => {}),
    createProcessorFn(() => {}, 'prebuild'),
    createProcessorFn(() => {}, 'postbuild'),
  ].forEach(attachedFn => {
    it(`should turn a non-buildable value into Buildable, when ${attachedFn.name} is given`, () => {
      // arrange
      const architectFn = quantity(1, attachedFn);
      const nonBuildable = null;

      // act
      const result = architectFn(nonBuildable);

      // assert
      const item = result[0];
      expect(isBuildable(item)).toBe(true);
    });

    it('should keep a buildable being passed-in and add additional attached functions to it', () => {
      // arrange
      const buildable = createBuildable(null, [attachedFn]);
      const architectFn = quantity(1, attachedFn);

      // act
      const result = architectFn(buildable);

      // assert
      const item: Buildable = result[0];
      expect(item.value).toEqual(buildable.value);
      expect(item.attachedFns).toEqual([attachedFn, attachedFn]);
    });
  });
});
