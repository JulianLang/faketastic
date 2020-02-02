import {
  createArchitectFn,
  createProcessorFn,
  createReaderFn,
  ExecutionTime,
} from '../../src/attached-fns';
import { createBuildable } from '../../src/buildable';
import { build } from '../../src/builder';
import { createValueFn } from '../../src/value-fns';

describe('build', () => {
  it('should build properties having a ValueFn', () => {
    // arrange
    const expectedValue = 'Pete';
    const valueFn = createValueFn(() => expectedValue);

    // act
    const result = build({ property: valueFn });

    // assert
    expect(result.property).toBe(expectedValue);
  });

  it('should assign properties having static values', () => {
    // arrange
    const staticValuesOnly = {
      string: '',
      number: 0,
      bool: false,
      fn: () => {},
      object: { number: 0 },
      array: [0, ''],
    };

    // act
    const result = build(staticValuesOnly);

    // assert
    expect(result.string).toBe('');
    expect(result.number).toBe(0);
    expect(result.bool).toBe(false);
    expect(result.fn).toBe(staticValuesOnly.fn);
    expect(result.object).toEqual({ number: 0 });
    expect(result.array).toEqual([0, '']);
  });

  // TODO: langju: maybe merge nested buildables into one, allowing kind of "containerization"
  it('should extract values from nested buildables', () => {
    // arrange
    const expectedValue = 0;
    const nestedLevel3 = createBuildable(expectedValue);
    const nestedLevel2 = createBuildable(nestedLevel3);
    const nestedLevel1 = createBuildable(nestedLevel2);
    const buildable = createBuildable(nestedLevel1);

    // act
    const result = build(buildable);

    // assert
    expect(result).toBe(expectedValue);
  });

  it('should call attached fns from nested buildables', () => {
    // arrange
    const someValue = 42;
    const otherValue = 4711;
    const expectedValue = [someValue, otherValue];
    const spy = jasmine.createSpy('fn', value => [value]).and.callThrough();
    const toArray = createArchitectFn(spy);
    const addOtherValue = createProcessorFn((v: any[]) => v.push(otherValue), 'postbuild');

    const nestedLevel2 = createBuildable(someValue);
    const nestedLevel1 = createBuildable(nestedLevel2, [toArray, addOtherValue]);
    const buildable = createBuildable(nestedLevel1);

    // act
    const result = build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedValue);
  });

  it('should eagerly/recursively build properties', () => {
    // arrange
    const expectedValue = 0;
    const nestedBuildable = createBuildable(expectedValue);
    const valueFn = createValueFn(() => nestedBuildable);
    const buildable = createBuildable(valueFn);

    // act
    const result = build(buildable);

    // assert
    expect(result).toBe(0);
  });

  it('should call reader functions', () => {
    // arrange
    const spy = jasmine.createSpy('readerFn');
    const someValue = null;
    const reader = createReaderFn(spy);
    const buildable = createBuildable(someValue, [reader]);

    // act
    build(buildable);

    // assert
    const recentCall = spy.calls.mostRecent();
    const arg = recentCall.args[0];

    expect(spy).toHaveBeenCalledTimes(1);
    expect(arg.parent).toBe(undefined);
    expect(arg.type).toBe('object');
    expect(arg.name).toBe('$root');
  });

  it('should call architect functions', () => {
    // arrange
    const spy = jasmine.createSpy('architectFn');
    const value = 42;
    const architect = createArchitectFn(spy);
    const buildable = createBuildable(value, [architect]);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should set the return value of architect functions', () => {
    // arrange
    const spy = jasmine.createSpy('architectFn');
    const spyArchitect = createArchitectFn(spy);
    const setValueArchitect = createArchitectFn(() => 42);
    const buildable = createBuildable(null, [setValueArchitect, spyArchitect]);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  (['prebuild', 'postbuild'] as ExecutionTime[]).forEach(processorType =>
    it('should set the return value of processor functions', () => {
      // arrange
      const spy = jasmine.createSpy('processorFn');
      const spyProcessor = createProcessorFn(spy, processorType);
      const setValueProcessor = createArchitectFn(() => 42);
      const buildable = createBuildable(null, [setValueProcessor, spyProcessor]);

      // act
      build(buildable);

      // assert
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(42);
    }),
  );

  it('should call preprocessor functions', () => {
    // arrange
    const spy = jasmine.createSpy('preprocessorFn');
    const value = 42;
    const preprocessor = createProcessorFn(spy, 'prebuild');
    const buildable = createBuildable(value, [preprocessor]);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should call postprocessor functions', () => {
    // arrange
    const spy = jasmine.createSpy('postprocessorFn');
    const value = 42;
    const postprocessor = createProcessorFn(spy, 'postbuild');
    const buildable = createBuildable(value, [postprocessor]);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should pass completely built values to postprocessor', () => {
    // arrange
    const spy = jasmine.createSpy('postprocessor');
    const postprocessor = createProcessorFn(spy, 'postbuild');

    const nestedValueFn = createValueFn(() => 42);
    const nestedBuildable = createBuildable(nestedValueFn);
    const valueFn = createValueFn(() => nestedBuildable);
    const buildable = createBuildable(valueFn, [postprocessor]);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledWith(42);
  });
});
