import { build, itself, model, oneOf, range, RecursionDepth, use } from '../../src';
import { includeBuilderFnSpecs } from '../spec-helpers/shared-specs';

describe('itself', () => {
  it('should throw if used without parent template', () => {
    // arrange
    const buildable = itself(() => ({ continue: true }));

    // act, assert
    expect(() => build(buildable)).toThrowMatching((err: Error) => err.message.includes('root'));
  });

  it('should recurse the parent template', () => {
    // arrange
    const name = 'Hans';
    const age = 42;
    const endValue = {};
    const tmpl = model({
      name: oneOf([name]),
      age: range(age, age),
      parent: itself(RecursionDepth(endValue, 1, 1)),
    });

    // act
    const result = build(tmpl);

    // assert
    expect(result).toBeDefined();
    expect(result.name).toEqual(name);
    expect(result.age).toEqual(age);
    expect(result.parent).toBeDefined();
    expect(result.parent.name).toEqual(name);
    expect(result.parent.age).toEqual(age);
    expect(result.parent.parent).toBe(endValue);
  });

  it('should be nestable', () => {
    // arrange
    const dirName = '.bin';
    const fileName = 'test.rtf';
    const fileEnd = null;
    const dirEnd: any[] = [];

    const File = model({
      name: oneOf([fileName]),
      symlink: itself(RecursionDepth(fileEnd, 1, 1)),
    });
    const Directory = model({
      name: oneOf([dirName]),
      file: use(File),
      directories: itself(RecursionDepth(dirEnd, 1, 1)),
    });

    // act
    const result = build(Directory);

    // assert
    expect(result).toBeDefined();
    expect(result.name).toEqual(dirName);

    expect(result.directories).toBeDefined();
    expect(result.directories.name).toEqual(dirName);
    expect(result.directories.directories).toEqual(dirEnd);

    expect(result.directories.file).toBeDefined();
    expect(result.directories.file.name).toEqual(fileName);

    expect(result.directories.file.symlink).toBeDefined();
    expect(result.directories.file.symlink.name).toEqual(fileName);
    expect(result.directories.file.symlink.symlink).toEqual(fileEnd);

    expect(result.file).toBeDefined();
    expect(result.file.name).toEqual(fileName);

    expect(result.file.symlink).toBeDefined();
    expect(result.file.symlink.name).toEqual(fileName);
    expect(result.file.symlink.symlink).toEqual(fileEnd);
  });

  includeBuilderFnSpecs(itself, {}, () => ({ endWithValue: [] }));
});
