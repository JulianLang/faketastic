import {
  AttachedFnSymbol,
  build,
  Buildable,
  BuildCycle,
  BuildCycleCallbackFn,
  BuilderFn,
  createArchitectFn,
  createProcessorFn,
  createTreeReaderFn,
  FnBuildCycleSymbol,
  FnCalledSymbol,
  FnOrderSymbol,
  getSymbol,
  hasSymbol,
  isBuildable,
  isValueFunction,
  setSymbol,
  UnsetValue,
  ValueFnSymbol,
} from '../../src';
import { AttachedFn, AttachedFnType, Func, MutatingFn } from '../../src/types';

export function includeAttachedFnSpecs(
  type: AttachedFnType,
  attachedFn: Function,
  ...params: any[]
) {
  it('should return an attached fn with correct type', () => {
    // arrange, act:
    const fn = attachedFn(...params);

    // assert
    expect(hasSymbol(AttachedFnSymbol, fn, type)).toBe(true);
  });
}

export function includeValueFnSpecs(valueFn: Func<any[], any>, ...params: any[]) {
  it('should add a builder function as value on the buildable', () => {
    // arrange
    // act
    const buildable = valueFn(...params);

    // assert
    expect(typeof buildable.value).toEqual('function');
    expect(typeof (buildable.value as any)[ValueFnSymbol]).toBeDefined();
    expect(isValueFunction(buildable.value)).toBe(true);
  });

  includeDirectiveFnSpecs(valueFn, ...params);
}

export function includeDirectiveFnSpecs(directiveFn: Function, ...params: any[]): void {
  it('should include given processor- and architect-functions in buildable', () => {
    // arrange
    const procFn = createProcessorFn(() => {}, 'tree-building', 'unsticky');
    const architectFn = createArchitectFn(() => {}, 'tree-building');
    const negativeTestFn = () => {};
    const processorFns: Function[] = [procFn, architectFn, negativeTestFn];

    // act
    const buildable: Buildable = directiveFn(...params, ...processorFns);

    // assert
    expect(buildable.processors).toContain(procFn);
    expect(buildable.architects).toContain(architectFn);
    expect(buildable.architects).not.toContain(negativeTestFn as any);
    expect(buildable.processors).not.toContain(negativeTestFn as any);
  });
}

export function includeTransparentTemplateFnSpecs(
  templateFn: Function,
  ...additionalParams: any[]
) {
  it('should include a deep clone of the given template', () => {
    // arrange
    const obj1 = {
      name: 'string',
    };
    const mdl = {
      a: obj1,
      b: () => {},
    };

    // act
    const buildable = templateFn(mdl, ...additionalParams);

    // assert
    const clonedA = buildable.value.a;
    const clonedB = buildable.value.b;

    expect(clonedA).toBeDefined();
    expect(clonedB).toBeDefined();
    expect(buildable.value === mdl).toBe(false);
    expect(clonedA === mdl.a).toBe(false);
    // functions do not get cloned
    expect(clonedB === mdl.b).toBe(true);
  });

  includeTemplateFnSpecs(templateFn, ...additionalParams);
}

export function includeTemplateFnSpecs(templateFn: Function, ...additionalParams: any[]) {
  it('should return a buildable', () => {
    // arrange
    // act
    const buildable = templateFn(...additionalParams);

    // assert
    expect(buildable).toBeDefined();
    expect(isBuildable(buildable)).toBeDefined();
  });
}

export function includeBuilderFnSpecs(builderFn: BuilderFn, ...params: any[]) {
  it('should return a buildable with UnsetValue', () => {
    // arrange, act
    const buildable = builderFn(...params);

    // assert
    expect(isBuildable(buildable)).toBe(true);
    expect(buildable.value === UnsetValue).toBe(true);
  });

  it('should add at least one mutating fn', () => {
    // arrange, act
    const buildable = builderFn(...params);

    // assert
    const mutatingFns: MutatingFn[] = [...buildable.architects, ...buildable.processors];
    expect(mutatingFns.length).toBeGreaterThan(0);
  });
}

export function testMutatingFnFactory(
  factory: Func<[BuildCycleCallbackFn, BuildCycle, number?], MutatingFn>,
  targetType: AttachedFnType,
) {
  it('should set the FnBuildCycleSymbol to correct cycle', () => {
    // arrange
    const expectedOrder: number = 42;

    // act
    const attachedFn = factory(() => {}, 'tree-building', expectedOrder);

    // assert
    expect(getSymbol(FnOrderSymbol, attachedFn)).toBe(expectedOrder);
  });

  testAttachedFnFactory(factory, targetType);
}

export function testAttachedFnFactory(
  factory: Func<[BuildCycleCallbackFn, BuildCycle], AttachedFn>,
  targetType: AttachedFnType,
) {
  it(`should set the AttachedFnSymbol to ${targetType} type`, () => {
    // act
    const attachedFn = factory(() => {}, 'postprocessor');

    // assert
    expect(getSymbol(AttachedFnSymbol, attachedFn)).toBe(targetType);
  });

  it('should set the FnBuildCycleSymbol to correct cycle', () => {
    // arrange
    const expectedCycle: BuildCycle = 'postprocessor';

    // act
    const attachedFn = factory(() => {}, expectedCycle);

    // assert
    expect(getSymbol(FnBuildCycleSymbol, attachedFn)).toBe(expectedCycle);
  });
}

export function transferAttachedFnsSpecs(builderFn: BuilderFn) {
  const spy = (name: string, fn: any) => jasmine.createSpy(name, fn).and.callThrough();

  it('should transfer AttachedFns to the dynamic content buildable', () => {
    // arrange
    const treeReader = createTreeReaderFn(
      spy('treeReader', () => setSymbol(FnCalledSymbol, treeReader)),
      'tree-building',
    );
    const architect = createArchitectFn(
      spy('architect', () => setSymbol(FnCalledSymbol, architect)),
      'tree-building',
    );
    const processor = createProcessorFn(
      spy('processor', () => setSymbol(FnCalledSymbol, processor)),
      'tree-building',
      'unsticky',
    );

    // act
    const mdl = builderFn(['A', 'B'], treeReader, architect, processor);
    build(mdl);

    // assert
    // TODO: langju: is calling the AttachedFns twice really good?
    // - first: on returned buildable of oneOf/someOf
    // - second: on dynamic chosen buildable [rebuildNode() in initializer of oneOf/someOf]
    expect(processor).toHaveBeenCalledTimes(2);
    expect(architect).toHaveBeenCalledTimes(2);
    expect(treeReader).toHaveBeenCalledTimes(2);
  });
}
