export const ProcessorSymbol = Symbol('faketastic.processor');
export type ProcessorType =
  | 'initializer'
  | 'preprocessor'
  | 'postprocessor'
  | 'finalizer';
