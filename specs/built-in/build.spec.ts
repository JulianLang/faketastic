import { createNode, ObjectTreeNode } from 'treelike';
import {
  build,
  Buildable,
  BuildCycle,
  canBe,
  createArchitectFn,
  createBuildable,
  createBuilderFn,
  createProcessorFn,
  oneOf,
  quantity,
  range,
  template,
  use,
} from '../../src';
import { BuildCycleCallbackFn, Func, MutatingFn } from '../../src/types';

describe('build function', () => {
  it('should run processor functions from top to buttom (treewise)', () => {
    // arrange
    const order: number[] = [];
    const newProcFn = (n: number) => createProcessorFn(() => order.push(n), 'initializer');

    const tmpl = template({
      a: use(
        {
          b: use({}, newProcFn(2)),
          c: use({}, newProcFn(3)),
        },
        newProcFn(1),
      ),
    });

    // act
    build(tmpl);

    // assert
    expect(order).toEqual([1, 2, 3]);
  });

  it('should not override null or undefined', () => {
    // arrange
    const tmpl = template({
      a: range(1, 2, canBe(null, 1)),
      b: range(1, 2, canBe(undefined, 1)),
    });

    // act
    const result = build(tmpl);

    // assert
    expect(result.a).toBe(null);
    expect(result.b).toBe(undefined);
  });

  it('should be nestable', () => {
    // arrange
    const Person = template({
      name: oneOf(['Hans', 'Norbert', 'Lilly']),
    });
    const Family = template({
      members: build(Person),
    });

    // act
    const family = build(Family);

    // assert
    expect(family).toBeDefined();
    expect(family.members).toBeDefined();
    expect(typeof family.members.name).toBe('string');
  });

  it('should be nestable with quantity', () => {
    // arrange
    const Person = template({
      name: oneOf(['Hans', 'Norbert', 'Lilly']),
    });
    const Family = template({
      members: build(Person, quantity(2)),
    });

    // act
    const family = build(Family);

    // assert
    expect(family).toBeDefined();
    expect(family.members).toBeDefined();
    expect(family.members.length).toBe(2);
    expect(typeof family.members[0].name).toBe('string');
    expect(typeof family.members[1].name).toBe('string');
  });

  it('should accept buildable arrays', () => {
    // arrange
    const value = [1, 2, 3];
    const tmpl = template(value);

    // act
    const result = build(tmpl);

    // assert
    expect(result).toEqual(value);
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

  includeBuildMutatingFnsSpecs(createProcessorFn, 'processors');

  includeBuildMutatingFnsSpecs(createArchitectFn, 'architects');
});

/** Specs testing `build`-fn to correctly run MutatingFns like `Architects` and `Processors`. */
export function includeBuildMutatingFnsSpecs(
  mutationFnFactory: Func<[BuildCycleCallbackFn, BuildCycle, ...any[]], MutatingFn>,
  targetProperty: keyof Buildable,
) {
  it(`should run ${String(targetProperty)} functions in correct order`, () => {
    // arrange
    const order: number[] = [];
    const expectedOrder: number[] = [0, 1, 2, 3];
    const processors: MutatingFn[] = [
      mutationFnFactory(() => order.push(0), 'initializer'),
      mutationFnFactory(() => order.push(1), 'preprocessor'),
      mutationFnFactory(() => order.push(2), 'postprocessor'),
      mutationFnFactory(() => order.push(3), 'finalizer'),
    ];
    const buildable = createBuildable({}, processors);

    // act
    build(buildable);

    // assert
    expect(order).toEqual(expectedOrder);
  });

  it(`should run ${String(targetProperty)} functions where they are located`, () => {
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
    const fns: MutatingFn[] = [
      mutationFnFactory(assertCorrectNodeFn, 'initializer'),
      mutationFnFactory(assertCorrectNodeFn, 'preprocessor'),
      mutationFnFactory(assertCorrectNodeFn, 'postprocessor'),
      mutationFnFactory(assertCorrectNodeFn, 'finalizer'),
    ];

    nestedBuildable[targetProperty] = fns as any;

    // act
    build(buildable);
  });

  it(`should respect ${String(targetProperty)} function ordering in all build cycles`, () => {
    // arrange
    const execFirst = 0;
    const execAfter = 1;

    const initalizerOrder: number[] = [];
    const preprocessorOrder: number[] = [];
    const postprocessorOrder: number[] = [];
    const finalizerOrder: number[] = [];
    const expectedOrder = [1, 2];

    const fns: MutatingFn[] = [
      // initializers
      mutationFnFactory(() => initalizerOrder.push(2), 'initializer', execAfter),
      mutationFnFactory(() => initalizerOrder.push(1), 'initializer', execFirst),
      // preprocessors
      mutationFnFactory(() => preprocessorOrder.push(2), 'preprocessor', execAfter),
      mutationFnFactory(() => preprocessorOrder.push(1), 'preprocessor', execFirst),
      // postprocessors
      mutationFnFactory(() => postprocessorOrder.push(2), 'postprocessor', execAfter),
      mutationFnFactory(() => postprocessorOrder.push(1), 'postprocessor', execFirst),
      // finalizers
      mutationFnFactory(() => finalizerOrder.push(2), 'finalizer', execAfter),
      mutationFnFactory(() => finalizerOrder.push(1), 'finalizer', execFirst),
    ];
    const buildable = createBuildable({}, fns);

    // negative test: arrange
    const negativeTestOrder: number[] = [];
    const negativeTestExpectedOrder = [2, 1];
    const negativeTestProcessors: MutatingFn[] = [
      // have same prio, so the order in array should define execution order:
      mutationFnFactory(() => negativeTestOrder.push(2), 'initializer', execAfter),
      mutationFnFactory(() => negativeTestOrder.push(1), 'initializer', execAfter),
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
}
