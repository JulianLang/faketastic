import { createNode, findNode, ObjectTreeNode, treeOf } from 'treelike';
import {
  AttachedFn,
  build,
  Buildable,
  buildChild,
  BuildCycle,
  BuildCycleCallbackFn,
  BuildRootSymbol,
  canBe,
  createArchitectFn,
  createBuildable,
  createProcessorFn,
  createTreeReaderFn,
  createValueFn,
  FnCalledSymbol,
  Func,
  hasSymbol,
  MutatingFn,
  oneOf,
  quantity,
  range,
  rebuild,
  setSymbol,
  template,
  UnsetValue,
  use,
} from '../../src';
import { createPlaceholder } from '../../src/placeholder';

describe('build', () => {
  it('should run processor functions from top to buttom (treewise)', () => {
    // arrange
    const order: number[] = [];
    const newProcFn = (n: number) =>
      createProcessorFn(() => order.push(n), 'initializer', 'unsticky');

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

  it('should leave placeholders untouched', () => {
    // arrange
    const buildable = createPlaceholder();
    const negativeTest = createBuildable(42);

    // act
    const result = build(buildable);
    const negativeResult = build(negativeTest);

    // assert
    expect(result).toBe(buildable);
    expect(negativeResult).toBe(42);
  });

  it('should warn the user when UnsetValue was detected in finalize', () => {
    // arrange
    spyOn(console, 'warn');
    const buildable = createBuildable(UnsetValue);

    // act
    build(buildable);

    // assert
    expect(console.warn).toHaveBeenCalledTimes(1);
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

  it('should call value functions and assign their result as value', () => {
    // arrange
    let wasCalled = false;
    const value = 'value';

    const valueFn = createValueFn(() => {
      wasCalled = true;
      return value;
    });

    const buildable = createBuildable({
      a: createBuildable(valueFn),
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
    const setChildrenOnValueNodeProcessor = createProcessorFn(
      (n: ObjectTreeNode) => {
        n.value = 42;
        n.children = [createNode('child', null)];
      },
      'initializer',
      'unsticky',
    );

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

  it('should execute build-cycle-callbacks in order: tree-reader, architects, processors', () => {
    // arrange
    const order: number[] = [];
    const treeReaderInit = createTreeReaderFn(() => order.push(1), 'initializer');
    const architectInit = createArchitectFn(() => order.push(2), 'initializer');
    const processorInit = createProcessorFn(() => order.push(3), 'initializer', 'unsticky');
    const treeReaderPre = createTreeReaderFn(() => order.push(4), 'preprocessor');
    const architectPre = createArchitectFn(() => order.push(5), 'preprocessor');
    const processorPre = createProcessorFn(() => order.push(6), 'preprocessor', 'unsticky');
    const treeReaderPost = createTreeReaderFn(() => order.push(7), 'postprocessor');
    const architectPost = createArchitectFn(() => order.push(8), 'postprocessor');
    const processorPost = createProcessorFn(() => order.push(9), 'postprocessor', 'unsticky');
    const treeReaderFin = createTreeReaderFn(() => order.push(10), 'finalizer');
    const architectFin = createArchitectFn(() => order.push(11), 'finalizer');
    const processorFin = createProcessorFn(() => order.push(12), 'finalizer', 'unsticky');

    const fns: AttachedFn[] = [
      treeReaderInit,
      architectInit,
      processorInit,
      treeReaderPre,
      architectPre,
      processorPre,
      treeReaderPost,
      architectPost,
      processorPost,
      treeReaderFin,
      architectFin,
      processorFin,
    ];

    const buildable = createBuildable({}, fns);

    // act
    build(buildable);

    // assert
    expect(order).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('should also include the root node passed in with buildChild', () => {
    // arrange
    const value = 42;
    const tree = treeOf({
      parent: {},
    });
    const parentNode = findNode(tree, n => n.name === 'parent')!;
    const nestedBuildable = createBuildable({ a: oneOf([value]) });

    // act
    const result = buildChild(nestedBuildable, parentNode);

    // assert
    expect(result).toBeDefined();
    expect(result.a).toEqual(value);
  });

  it('should mark root node of build() with BuildRootSymbol', () => {
    // arrange
    const assertTreeReader = createTreeReaderFn(node => {
      // assert
      expect(hasSymbol(BuildRootSymbol, node)).toBe(true);
    }, 'initializer');
    const buildable = createBuildable({}, [assertTreeReader]);

    // act
    build(buildable);
  });

  includeBuildMutatingFnsSpecs(
    (fn, cycle, order) => createProcessorFn(fn, cycle, 'unsticky', order),
    'processors',
  );

  includeBuildMutatingFnsSpecs(createArchitectFn, 'architects');
});

/** Specs testing `build`-fn to correctly run MutatingFns like `Architects` and `Processors`. */
function includeBuildMutatingFnsSpecs(
  mutationFnFactory: Func<[BuildCycleCallbackFn, BuildCycle, number?], MutatingFn>,
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

describe('rebuild', () => {
  it('should run all attached fns in given cycle-range', () => {
    // arrange
    const fakeReader: BuildCycleCallbackFn = jasmine
      .createSpy('tree-reader', () => setSymbol(FnCalledSymbol, fakeReader))
      .and.callThrough();
    const fakeArchitect: BuildCycleCallbackFn = jasmine
      .createSpy('architect', () => setSymbol(FnCalledSymbol, fakeArchitect))
      .and.callThrough();
    const fakeProcessor: BuildCycleCallbackFn = jasmine
      .createSpy('processor', () => setSymbol(FnCalledSymbol, fakeProcessor))
      .and.callThrough();

    const attachedFns: AttachedFn[] = [
      // tree-reader
      createTreeReaderFn(fakeReader, 'preprocessor'),
      // architect
      createArchitectFn(fakeArchitect, 'postprocessor'),
      // processor
      createProcessorFn(fakeProcessor, 'finalizer', 'unsticky'),
    ];
    const buildable = createBuildable({}, attachedFns);
    const node = createNode('$root', buildable);

    // act
    rebuild(node, 'finalizer');

    // assert
    expect(fakeReader).toHaveBeenCalledTimes(1);
    expect(fakeArchitect).toHaveBeenCalledTimes(1);
    expect(fakeProcessor).toHaveBeenCalledTimes(1);
  });

  it('should not call attached fns, that are already called', () => {
    // arrange: pre-condition
    const fakeReader: BuildCycleCallbackFn = jasmine
      .createSpy('tree-reader', node => setSymbol(FnCalledSymbol, fakeReader, node))
      .and.callThrough();
    const fakeArchitect: BuildCycleCallbackFn = jasmine
      .createSpy('architect', node => setSymbol(FnCalledSymbol, fakeArchitect, node))
      .and.callThrough();
    const fakeProcessor: BuildCycleCallbackFn = jasmine
      .createSpy('processor', node => setSymbol(FnCalledSymbol, fakeProcessor, node))
      .and.callThrough();

    const attachedFns: AttachedFn[] = [
      // tree-reader
      createTreeReaderFn(fakeReader, 'preprocessor'),
      // architect
      createArchitectFn(fakeArchitect, 'postprocessor'),
      // processor
      createProcessorFn(fakeProcessor, 'finalizer', 'unsticky'),
    ];
    const buildable = createBuildable({}, attachedFns);
    const node = createNode('$root', buildable);

    // act: pre-condition
    rebuild(node, 'finalizer');

    // assert: pre-condition
    expect(fakeReader).toHaveBeenCalled();
    expect(fakeArchitect).toHaveBeenCalled();
    expect(fakeProcessor).toHaveBeenCalled();

    // arrange
    (fakeReader as jasmine.Spy).calls.reset();
    (fakeArchitect as jasmine.Spy).calls.reset();
    (fakeProcessor as jasmine.Spy).calls.reset();

    // act
    rebuild(node, 'finalizer');

    // assert
    expect(fakeReader).not.toHaveBeenCalled();
    expect(fakeArchitect).not.toHaveBeenCalled();
    expect(fakeProcessor).not.toHaveBeenCalled();
  });

  it('should build nodes before running postprocessor', () => {
    // arrange
    const valueFn = createValueFn(() => 42);
    const buildable = createBuildable(valueFn);
    const node = createNode('$root', buildable);

    // act
    rebuild(node, 'finalizer');

    // assert
    expect(buildable.value).toBe(42);
  });
});