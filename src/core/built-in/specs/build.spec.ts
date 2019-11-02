import { ObjectTreeNode } from 'object-tree';
import { createBuilderFn, createProcessorFn } from '../../util';
import { build } from '../build';
import { createBuildable } from './shared/spec.helper';

describe('build function', () => {
  it('should return a value of same type as the input, if quantity is constant 1', () => {
    // arrange
    const input = createBuildable({});
    const inputType = typeof input;

    // act
    const resultA = build(input);
    const resultB = build(input, 1);

    // assert
    expect(typeof resultA).toEqual(inputType);
    expect(Array.isArray(resultA)).toEqual(false);

    expect(typeof resultB).toEqual(inputType);
    expect(Array.isArray(resultB)).toEqual(false);
  });

  it('should return an array of the input type, if quantity is greater than 1', () => {
    // arrange
    const input = createBuildable({});

    // act
    const result = build(input, 2);

    // assert
    expect(Array.isArray(result)).toEqual(true);
  });

  it('should return an array of the input type, if quantity is a function returning 1', () => {
    // arrange
    const input = createBuildable({});
    const numberOfItems = 1;

    // act
    const result = build(input, () => numberOfItems);

    // assert
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toBe(numberOfItems);
  });

  it('should return an empty array of the input type, if quantity is a function returning 0', () => {
    // arrange
    const input = createBuildable({});
    const numberOfItems = 0;
    // act
    const result = build(input, () => numberOfItems);

    // assert
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(numberOfItems);
  });

  it('should return an empty array of the input type, if quantity is constant 0', () => {
    // arrange
    const input = createBuildable({});
    const numberOfItems = 0;
    // act
    const result = build(input, numberOfItems);

    // assert
    expect(Array.isArray(result)).toEqual(true);
    expect(result.length).toEqual(numberOfItems);
  });

  it('should run processor functions in correct order', () => {
    // arrange
    const order: number[] = [];
    const expectedOrder: number[] = [0, 1, 2, 3];
    const buildable = createBuildable({});
    const processors: Function[] = [
      createProcessorFn(() => order.push(0), 'initializer'),
      createProcessorFn(() => order.push(1), 'preprocessor'),
      createProcessorFn(() => order.push(2), 'postprocessor'),
      createProcessorFn(() => order.push(3), 'finalizer'),
    ];

    buildable.processors = processors;

    // act
    build(buildable);

    // assert
    expect(order).toEqual(expectedOrder);
  });

  it('should run processor functions where they are located', () => {
    // arrange
    const nestedBuildable = createBuildable({});
    const buildable = createBuildable({
      a: nestedBuildable,
    });

    // assert
    const assertCorrectNodeFn = (node: ObjectTreeNode<any>) => {
      expect(node.name).toBe('a');
      expect(node.value).toBe(nestedBuildable);
    };

    // ... arrange (continuation)
    const processors: Function[] = [
      createProcessorFn(assertCorrectNodeFn, 'initializer'),
      createProcessorFn(assertCorrectNodeFn, 'preprocessor'),
      createProcessorFn(assertCorrectNodeFn, 'postprocessor'),
      createProcessorFn(assertCorrectNodeFn, 'finalizer'),
    ];

    nestedBuildable.processors = processors;

    // act
    build(buildable);
  });

  it('should call builder functions and assign their result as value', () => {
    // arrange
    let wasCalled = false;
    const value = 'value';

    const builderFn = createBuilderFn(() => {
      wasCalled = true;
      return value;
    });

    const buildable = createBuildable({
      a: createBuildable(builderFn),
    });

    // act
    const result = build(buildable);

    // assert
    expect(result).toBeDefined();
    expect(result.a).toBeDefined();
    expect(result.a).toEqual(value);
    expect(wasCalled).toBe(true);
  });
});
