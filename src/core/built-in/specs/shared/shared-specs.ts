import { BuildableSymbol, BuilderFnSymbol, ProcessorSymbol } from '../../../types';

export function includeProcessorFnSpecs(processorFn: Function, ...params: any[]) {
  it('should return a processor fn', () => {
    // arrange
    // act
    const processor = processorFn(...params);

    // assert
    expect((processor as any)[ProcessorSymbol]).toBeDefined();
  });
}

export function includeBuilderFnSpecs(builderFn: Function, ...params: any[]) {
  it('should add a builder function as value on the buildable', () => {
    // arrange
    // act
    const buildable = builderFn(...params);

    // assert
    expect(typeof buildable.value).toEqual('function');
    expect(typeof (buildable.value as any)[BuilderFnSymbol]).toBeDefined();
  });

  includeDirectiveFnSpecs(builderFn, ...params);
}

export function includeDirectiveFnSpecs(directiveFn: Function, ...params: any[]): void {
  it('should include given processor functions in buildable', () => {
    // arrange
    const processorFns: Function[] = [() => {}, () => {}, () => {}];

    // act
    const buildable = directiveFn(...params, ...processorFns);

    // assert
    expect(buildable.processors).toEqual(processorFns);
  });

  includeStatementFnSpecs(directiveFn, ...params);
}

export function includeTemplateFnSpecs(templateFn: Function, ...additionalParams: any[]) {
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
}

export function includeStatementFnSpecs(statementFn: Function, ...params: any[]) {
  it('should return a buildable', () => {
    // arrange
    // act
    const buildable = statementFn(...params);

    // assert
    expect(buildable).toBeDefined();
    expect((buildable as any)[BuildableSymbol]).toBeDefined();
  });
}
