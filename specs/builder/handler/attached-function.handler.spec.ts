import { createArchitectFn, createProcessorFn, createReaderFn } from '../../../src/attached-fns';
import { Buildable, createBuildable } from '../../../src/buildable';
import { handleAttachedFns } from '../../../src/builder/handler/attached-fn.handler';
import { AttachedFunctionHandler } from '../../../src/builder/handler/attached-function.handler';
import { FaketasticNode } from '../../../src/types';

function createHandler(buildable: Buildable<any>): AttachedFunctionHandler {
  const node = {
    value: buildable,
    setValue: value => {},
  } as FaketasticNode;

  return handleAttachedFns(node);
}

describe('AttachedFunctionHandler', () => {
  it('should return a working handler object', () => {
    // arrange
    const node = {} as FaketasticNode;

    // act
    const handler = handleAttachedFns(node);

    // assert
    expect(handler).toBeDefined();
  });

  it('should run all reader functions of the node`s buildable', () => {
    // arrange
    const spy = jasmine.createSpy();
    const readerFn = createReaderFn(spy);
    const attachedFns = [readerFn, readerFn];
    const buildable = createBuildable(undefined, attachedFns);
    const handler = createHandler(buildable);

    // act
    handler.runReaderFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(attachedFns.length);
  });

  it('should run all architect functions of the node`s buildable', () => {
    // arrange
    const spy = jasmine.createSpy();
    const architect = createArchitectFn(spy);
    const attachedFns = [architect, architect];
    const buildable = createBuildable(undefined, attachedFns);
    const handler = createHandler(buildable);

    // act
    handler.runArchitectFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(attachedFns.length);
  });

  it('should set the return value of architect functions', () => {
    // arrange
    const spy = jasmine.createSpy('architectFn');
    const spyArchitect = createArchitectFn(spy);
    const setValueArchitect = createArchitectFn(() => 42);
    const buildable = createBuildable(null, [setValueArchitect, spyArchitect]);
    const handler = createHandler(buildable);

    // act
    handler.runArchitectFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should pass the value into architects that desire this type', () => {
    // arrange
    const value = 42;
    const spy = jasmine.createSpy();
    const architect = createArchitectFn(spy, 'value');
    const buildable = createBuildable(value, [architect]);
    const handler = createHandler(buildable);

    // act
    handler.runArchitectFns();

    // assert
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should pass the buildable into architects that desire this type', () => {
    // arrange
    const value = 42;
    const spy = jasmine.createSpy();
    const architect = createArchitectFn(spy, 'buildable');
    const buildable = createBuildable(value, [architect]);
    const handler = createHandler(buildable);

    // act
    handler.runArchitectFns();

    // assert
    expect(spy).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should run all preprocessor functions of the node`s buildable', () => {
    // arrange
    const spy = jasmine.createSpy();
    const preprocessor = createProcessorFn(spy, 'prebuild');
    const attachedFns = [preprocessor, preprocessor];
    const buildable = createBuildable(undefined, attachedFns);
    const handler = createHandler(buildable);

    // act
    handler.runPreprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(attachedFns.length);
  });

  it('should set the return value of preprocessor functions', () => {
    // arrange
    const spy = jasmine.createSpy('processorFn');
    const spyProcessor = createProcessorFn(spy, 'prebuild');
    const setValueProcessor = createProcessorFn(() => 42, 'prebuild');
    const buildable = createBuildable(null, [setValueProcessor, spyProcessor]);
    const handler = createHandler(buildable);

    // act
    handler.runPreprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should pass the value into preprocessors that desire this type', () => {
    // arrange
    const value = 42;
    const spy = jasmine.createSpy();
    const preprocessor = createProcessorFn(spy, 'prebuild', 'value');
    const buildable = createBuildable(value, [preprocessor]);
    const handler = createHandler(buildable);

    // act
    handler.runPreprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledWith(value);
  });

  it('should pass the buildable into preprocessors that desire this type', () => {
    // arrange
    const value = 42;
    const spy = jasmine.createSpy();
    const preprocessor = createProcessorFn(spy, 'prebuild', 'buildable');
    const buildable = createBuildable(value, [preprocessor]);
    const handler = createHandler(buildable);

    // act
    handler.runPreprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('should run all postprocessor functions of the node`s buildable', () => {
    // arrange
    const spy = jasmine.createSpy();
    const postprocessor = createProcessorFn(spy, 'postbuild');
    const attachedFns = [postprocessor, postprocessor];
    const buildable = createBuildable(undefined, attachedFns);
    const handler = createHandler(buildable);

    // act
    handler.runPostprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(attachedFns.length);
  });

  it('should set the return value of postprocessor functions', () => {
    // arrange
    const spy = jasmine.createSpy('processorFn');
    const spyProcessor = createProcessorFn(spy, 'postbuild');
    const setValueProcessor = createProcessorFn(() => 42, 'postbuild');
    const buildable = createBuildable(null, [setValueProcessor, spyProcessor]);
    const handler = createHandler(buildable);

    // act
    handler.runPostprocessorFns();

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should throw if an unknown ReadType was passed in', () => {
    // arrange
    const unknownType = 'my-type';
    const attachedFnWithUnknownReadType = createArchitectFn(() => {}, unknownType as any);
    const buildable = createBuildable(null, [attachedFnWithUnknownReadType]);
    const handler = createHandler(buildable);

    // act, assert
    expect(() => handler.runArchitectFns()).toThrowMatching(
      (err: Error) => err.message.indexOf(unknownType) >= 0,
    );
  });
});
