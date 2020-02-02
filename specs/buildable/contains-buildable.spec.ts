import { treeOf } from 'treelike';
import { containsBuildable, createBuildable } from '../../src/buildable';

describe('containsBuildable', () => {
  const buildable = createBuildable(null);

  [
    buildable,
    {},
    { a: 0, b: false, c: '', d: () => {}, e: {} },
    [],
    [0, '', false, () => {}, {}],
    0,
    false,
    '',
    () => false,
    null,
    undefined,
  ].forEach(value => {
    it('should return false for static values and builables directly on node', () => {
      // arrange
      const tree = treeOf(value);

      // act
      const result = containsBuildable(tree);

      // assert
      expect(result).toBe(false);
    });
  });

  [
    [buildable],
    [[buildable]],
    { a: buildable },
    { a: { before: '', nested: buildable, behind: 0 } },
  ].forEach(value => {
    it(`should return true for buildable value "${JSON.stringify(value)}" `, () => {
      // arrange
      const tree = treeOf(value);

      // act
      const result = containsBuildable(tree);

      // assert
      expect(result).toBe(true);
    });
  });
});
