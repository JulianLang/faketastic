import {
  createArchitectFn,
  createBuildable,
  createProcessorFn,
  createTreeReaderFn,
  createValueFn,
  FnCalledSymbol,
  isBuilt,
  setSymbol,
} from '../../../src';

describe('isBuilt', () => {
  it('should return true if all fns are marked as called', () => {
    // arrange
    const treeReader = createTreeReaderFn(() => {}, 'initializer');
    const architect = createArchitectFn(() => {}, 'initializer');
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');
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
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');
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
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');
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
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');
    const attachedFns = [treeReader, architect, processor];
    setSymbol(FnCalledSymbol, architect);
    setSymbol(FnCalledSymbol, processor);
    const buildable = createBuildable({}, attachedFns);

    // act, assert
    // note: did not set Symbol for treeReader.
    expect(isBuilt(buildable)).toBe(false);
  });

  it('should consider presence of valueFns for build cycles >= postprocessor', () => {
    // arrange
    const valueFn = createValueFn(() => null);
    const buildable = createBuildable(valueFn);

    // act, assert
    expect(isBuilt(buildable, 'postprocessor')).toBe(false);
  });

  it('should not consider presence of valueFns for build cycles < postprocessor', () => {
    // arrange
    const valueFn = createValueFn(() => null);
    const buildable = createBuildable(valueFn);

    // act, assert
    expect(isBuilt(buildable, 'preprocessor')).toBe(true);
  });
});
