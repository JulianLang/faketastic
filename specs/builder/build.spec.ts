import { createNode } from 'treelike';
import { createArchitectFn, createProcessorFn, createReaderFn } from '../../src/attached-fns';
import { createBuildable, isBuildable } from '../../src/buildable';
import { build, _forTestsOnly } from '../../src/builder';
import { AttachedFunctionHandler } from '../../src/builder/handler/attached-function.handler';
import { Type, Types } from '../../src/constants';
import { FaketasticNode } from '../../src/types';
import { setType, toFaketasticNode } from '../../src/util';
import { createValueFn } from '../../src/value-fns';

describe('build', () => {
  it('should call ValueFn with the buildable they are located on', () => {
    // arrange
    const spy = jasmine.createSpy('valueFn');
    const valueFn = createValueFn(spy);
    const buildable = createBuildable(valueFn);

    // act
    build({ property: buildable });

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(buildable);
  });

  it('should call ValueFn with a builable even if the original value is none', () => {
    // arrange
    const spy = jasmine.createSpy('valueFn');
    const valueFn = createValueFn(spy);

    // act
    build({ property: valueFn });

    // assert
    /*
        note: expected arg is Buildable<undefined>, as the valueFn spy will return undefined.
    */
    const expectedArg = createBuildable(undefined);
    expect(spy).toHaveBeenCalledWith(expectedArg);
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
    const value1 = 42;
    const value2 = 4711;
    const expectedValue = [value1, value2];

    const spy = jasmine.createSpy('fn', value => [value]).and.callThrough();
    const toArray = createArchitectFn(spy);
    const addOtherValue = createProcessorFn((v: any[]) => {
      v.push(value2);
      return v;
    }, 'postbuild');

    const nestedLevel2 = createBuildable(value1);
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
    expect(arg.type).toBe('value');
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

  it('should call reference functions', () => {
    // arrange
    const spy = jasmine.createSpy('refSpy');
    const refFn = setType(Types.ReferenceFn, spy);
    const buildable = createBuildable(refFn);

    // act
    build(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('build: createAttachedFnHandler', () => {
  it('should convert a node`s value into a buildable', () => {
    // arrange
    const node = createNode('', null);
    const faketasticNode = toFaketasticNode(node);

    // act
    _forTestsOnly.createAttachedFnHandler(faketasticNode);

    // assert
    expect(isBuildable(faketasticNode.value)).toBe(true);
  });

  it('should return the handler', () => {
    // arrange
    const node = createNode('', null);
    const faketasticNode = toFaketasticNode(node);

    // act
    const handler = _forTestsOnly.createAttachedFnHandler(faketasticNode);

    // assert
    expect(handler).toBeTruthy();
  });
});

describe('build: markBranchRefDependent', () => {
  it('should mark the node it is called on and its parents as ref-dependent', () => {
    /*
      test tree looks like:

       (parent2)
           |
       (parent1)
           |
       (parent)
           |
        (node)
    */
    // arrange
    const node = createNode('node', null);
    const parent = createNode('parent', null, [node]);
    const parent1 = createNode('parent1', null, [parent]);
    const parent2 = createNode('parent2', null, [parent1]);
    node.parent = parent;
    parent.parent = parent1;
    parent1.parent = parent2;
    const faketasticNode = toFaketasticNode(parent2);
    const faketasticLeafNode = faketasticNode.children[0].children[0].children[0];

    // act
    _forTestsOnly.markBranchRefDependent(faketasticLeafNode);

    // assert
    let current: FaketasticNode | undefined = faketasticLeafNode;

    while (current) {
      expect(current[Type]).toBe(Types.ReferenceDependent);
      current = current.parent;
    }
  });
});

describe('build: resolveReference', () => {
  it('should call the reference fn if it the value of the given node', () => {
    // arrange
    const expectedValue = 42;
    const refFn = setType(Types.ReferenceFn, () => expectedValue);
    const node = createNode('refNode', refFn);
    const faketasticNode = toFaketasticNode(node);

    // act
    _forTestsOnly.resolveReference(faketasticNode);

    // assert
    expect(faketasticNode.value).toBe(expectedValue);
  });

  it('should find and call the reference fn within a builable', () => {
    // arrange
    const expectedValue = 42;
    const refFn = setType(Types.ReferenceFn, () => expectedValue);
    const buildable = createBuildable(refFn);

    const node = createNode('node > Buildable > RefFn', buildable);
    const faketasticNode = toFaketasticNode(node);

    // act
    _forTestsOnly.resolveReference(faketasticNode);

    // assert
    expect(faketasticNode.value).toBe(buildable);
    expect(buildable.value).toBe(expectedValue);
  });
});

describe('build: resolveIfReference', () => {
  it('should call postprocessors', () => {
    // arrange
    const mockHandler = ({
      runPostprocessorFns: jasmine.createSpy(),
    } as unknown) as AttachedFunctionHandler;
    const node = createNode('node', null);
    const faketasticNode = toFaketasticNode(node);
    setType(Types.ReferenceDependent, faketasticNode);

    // act
    _forTestsOnly.resolveIfReference(faketasticNode, mockHandler);

    // assert
    expect(mockHandler.runPostprocessorFns).toHaveBeenCalledTimes(1);
  });
});

// TODO: langju: how to test caching of AttachedFnHandler in build.buildData()
