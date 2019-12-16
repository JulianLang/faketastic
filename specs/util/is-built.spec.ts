import {
  createArchitectFn,
  createBuildable,
  createBuilderFn,
  createProcessorFn,
  createTreeReaderFn,
  FnCalledSymbol,
  isBuilt,
  setSymbol,
} from '../../src';

describe('isBuilt helper function', () => {
  it('should return true if all fns are marked as called', () => {
    // arrange
    const treeReader = createTreeReaderFn(() => {}, 'initializer');
    const architect = createArchitectFn(() => {}, 'initializer');
    const processor = createProcessorFn(() => {}, 'initializer');
    const attachedFns = [treeReader, architect, processor];
    setSymbol(FnCalledSymbol, treeReader);
    setSymbol(FnCalledSymbol, architect);
    setSymbol(FnCalledSymbol, processor);

    const buildable = createBuildable({}, attachedFns);

    // act, assert
    expect(isBuilt(buildable)).toBe(true);
  });

  it('should return true if any fn is not marked as called', () => {
    // arrange
    const treeReader = createTreeReaderFn(() => {}, 'initializer');
    const architect = createArchitectFn(() => {}, 'initializer');
    const processor = createProcessorFn(() => {}, 'initializer');
    const attachedFns = [treeReader, architect, processor];
    // note: not setting Symbol for treeReader.
    setSymbol(FnCalledSymbol, architect);
    setSymbol(FnCalledSymbol, processor);

    const buildable = createBuildable({}, attachedFns);

    // act, assert
    expect(isBuilt(buildable)).toBe(false);
  });

  it('should not consider fns not being in targeted cycle range', () => {
    // arrange
    const treeReader = createTreeReaderFn(() => {}, 'postprocessor');
    const architect = createArchitectFn(() => {}, 'initializer');
    const processor = createProcessorFn(() => {}, 'initializer');
    const attachedFns = [treeReader, architect, processor];
    setSymbol(FnCalledSymbol, architect);
    setSymbol(FnCalledSymbol, processor);
    const buildable = createBuildable({}, attachedFns);

    // act, assert
    // note: did not set Symbol for treeReader.
    // but: treeReader is postprocessor, and should not be considered.
    expect(isBuilt(buildable, 'initializer')).toBe(true);
  });

  it('should consider all cycles in range', () => {
    // arrange
    const treeReader = createTreeReaderFn(() => {}, 'finalizer');
    const architect = createArchitectFn(() => {}, 'postprocessor');
    const processor = createProcessorFn(() => {}, 'initializer');
    const attachedFns = [treeReader, architect, processor];
    setSymbol(FnCalledSymbol, architect);
    setSymbol(FnCalledSymbol, processor);
    const buildable = createBuildable({}, attachedFns);

    // act, assert
    // note: did not set Symbol for treeReader.
    expect(isBuilt(buildable)).toBe(false);
  });

  it('should consider presence of builderFns for build cycles >= postprocessor', () => {
    // arrange
    const builderFn = createBuilderFn(() => null);
    const buildable = createBuildable(builderFn);

    // act, assert
    expect(isBuilt(buildable, 'postprocessor')).toBe(false);
  });

  it('should not consider presence of builderFns for build cycles < postprocessor', () => {
    // arrange
    const builderFn = createBuilderFn(() => null);
    const buildable = createBuildable(builderFn);

    // act, assert
    expect(isBuilt(buildable, 'preprocessor')).toBe(true);
  });
});
