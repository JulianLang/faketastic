import { ProcessorSymbol } from '../../../core';

export function includeProcessorFnSpecs(processorFn: Function, ...params: any[]) {
  it('should return a processor fn', () => {
    // arrange
    // act
    const processor = processorFn(...params);

    // assert
    expect((processor as any)[ProcessorSymbol]).toBeDefined();
  });
}
