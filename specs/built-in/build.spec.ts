import { createNode, ObjectTreeNode } from 'treelike';
import {
  build,
  buildDynamicTemplate,
  createBuildable,
  createBuilderFn,
  createProcessorFn,
  oneOf,
  ProcessorFn,
} from '../../src';

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
    const processors: ProcessorFn[] = [
      createProcessorFn(() => order.push(0), 'initializer'),
      createProcessorFn(() => order.push(1), 'preprocessor'),
      createProcessorFn(() => order.push(2), 'postprocessor'),
      createProcessorFn(() => order.push(3), 'finalizer'),
    ];
    const buildable = createBuildable({}, processors);

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
    const processors: ProcessorFn[] = [
      createProcessorFn(assertCorrectNodeFn, 'initializer'),
      createProcessorFn(assertCorrectNodeFn, 'preprocessor'),
      createProcessorFn(assertCorrectNodeFn, 'postprocessor'),
      createProcessorFn(assertCorrectNodeFn, 'finalizer'),
    ];

    nestedBuildable.processors = processors;

    // act
    build(buildable);
  });

  it('should respect processor function ordering in all build cycles', () => {
    // arrange
    const execFirst = 0;
    const execAfter = 1;

    const initalizerOrder: number[] = [];
    const preprocessorOrder: number[] = [];
    const postprocessorOrder: number[] = [];
    const finalizerOrder: number[] = [];
    const expectedOrder = [1, 2];

    const processors: ProcessorFn[] = [
      // initializers
      createProcessorFn(() => initalizerOrder.push(2), 'initializer', execAfter),
      createProcessorFn(() => initalizerOrder.push(1), 'initializer', execFirst),
      // preprocessors
      createProcessorFn(() => preprocessorOrder.push(2), 'preprocessor', execAfter),
      createProcessorFn(() => preprocessorOrder.push(1), 'preprocessor', execFirst),
      // postprocessors
      createProcessorFn(() => postprocessorOrder.push(2), 'postprocessor', execAfter),
      createProcessorFn(() => postprocessorOrder.push(1), 'postprocessor', execFirst),
      // finalizers
      createProcessorFn(() => finalizerOrder.push(2), 'finalizer', execAfter),
      createProcessorFn(() => finalizerOrder.push(1), 'finalizer', execFirst),
    ];
    const buildable = createBuildable({}, processors);

    // negative test: arrange
    const negativeTestOrder: number[] = [];
    const negativeTestExpectedOrder = [2, 1];
    const negativeTestProcessors: ProcessorFn[] = [
      // have same prio, so the order in array should define execution order:
      createProcessorFn(() => negativeTestOrder.push(2), 'initializer', execAfter),
      createProcessorFn(() => negativeTestOrder.push(1), 'initializer', execAfter),
    ];
    const negativeTestBuildable = createBuildable({}, negativeTestProcessors);

    // act
    build(buildable);
    build(negativeTestBuildable);

    // assert
    expect(initalizerOrder).toEqual(expectedOrder);
    expect(preprocessorOrder).toEqual(expectedOrder);
    expect(postprocessorOrder).toEqual(expectedOrder);
    expect(finalizerOrder).toEqual(expectedOrder);
    expect(negativeTestOrder).toEqual(negativeTestExpectedOrder);
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

  it('should call builder functions and build their return value when it is a Buildable itself', () => {
    // arrange
    const value = 'value';
    const valueTemplate = { b: oneOf([value]) };
    const buildableValue = createBuildable(valueTemplate);
    const builderFn = createBuilderFn(() => buildableValue);

    const buildable = createBuildable({
      a: createBuildable(builderFn),
    });

    // act
    const result = build(buildable);

    // assert
    expect(result).toBeDefined();
    expect(result.a).toBeDefined();
    expect(result.a).toEqual({ b: value });
    expect(result.a).not.toBe(valueTemplate);
  });
});

describe('buildDynamicTemplate', () => {
  it('should build a template and return the built value', () => {
    // arrange
    const buildable = createBuildable({
      a: oneOf(['hello']),
      b: 'world',
    });

    // act
    const result = buildDynamicTemplate(buildable, null);

    // assert
    expect(result).toEqual({
      a: 'hello',
      b: 'world',
    });
  });

  it('should attach the built value to a host node', () => {
    // arrange
    const hostName = 'hostName';
    const assertionProcessor = createProcessorFn((node: ObjectTreeNode) => {
      // assert
      expect(node.parent).toBeDefined();
      expect(node.parent!.name).toBe(hostName);
    }, 'initializer');

    const host = createNode(hostName, null, []);
    const buildable = createBuildable({}, [assertionProcessor]);

    // act
    buildDynamicTemplate(buildable, host);
  });
});
