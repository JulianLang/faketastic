import { createNode, ObjectTreeNode } from 'treelike';
import {
  build,
  createBuildable,
  createBuilderFn,
  createProcessorFn,
  oneOf,
  ProcessorFn,
  template,
} from '../../src';

describe('build function', () => {
  it('should accept buildable arrays', () => {
    // arrange
    const value = [1, 2, 3];
    const tmpl = template(value);

    // act
    const result = build(tmpl);

    // assert
    expect(result).toEqual(value);
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

  it('should build children of value nodes', () => {
    // arrange
    const setChildrenOnValueNodeProcessor = createProcessorFn((n: ObjectTreeNode) => {
      n.value = 42;
      n.children = [createNode('child', null)];
    }, 'initializer');

    const buildable = createBuildable({
      /*
        the processor will do two things in order to provocate a value node with children:
        1) it sets a value on the property-node "a" in order to make it a value-node.
        2) add children to the node, which is not allowed and something faketastic should be able to handle
      */
      a: oneOf([1, 2, 3], setChildrenOnValueNodeProcessor),
    });

    // act
    // assert
    expect(() => build(buildable)).not.toThrow();
  });
});
