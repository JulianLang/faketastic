import {
  AttachedFnSymbol,
  Buildable,
  BuildableSymbol,
  createArchitectFn,
  createProcessorFn,
  hasSymbol,
  isValueFunction,
  ValueFnSymbol,
} from '../../src';
import { Func } from '../../src/types';

export function includeProcessorFnSpecs(processorFn: Function, ...params: any[]) {
  it('should return a processor fn', () => {
    // arrange
    // act
    const processor = processorFn(...params);

    // assert
    expect(hasSymbol(AttachedFnSymbol, processor, 'processor')).toBe(true);
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
    const procFn = createProcessorFn(() => {}, 'initializer');
    const architectFn = createArchitectFn(() => {}, 'initializer');
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
    const tmpl = {
      a: obj1,
      b: () => {},
    };

    // act
    const buildable = templateFn(tmpl, ...additionalParams);

    // assert
    const clonedA = buildable.value.a;
    const clonedB = buildable.value.b;

    expect(clonedA).toBeDefined();
    expect(clonedB).toBeDefined();
    expect(buildable.value === tmpl).toBe(false);
    expect(clonedA === tmpl.a).toBe(false);
    // functions do not get cloned
    expect(clonedB === tmpl.b).toBe(true);
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
    expect((buildable as any)[BuildableSymbol]).toBeDefined();
  });
}
