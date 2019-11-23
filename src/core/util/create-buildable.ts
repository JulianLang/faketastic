import { Buildable, BuildableSymbol, ProcessorFn } from '../types';

export function createBuildable<T>(tmpl: T, processors: ProcessorFn[] = []): Buildable<T> {
  const buildable: Buildable<any> = {
    [BuildableSymbol]: 'template',
    processors,
    value: tmpl,
  };

  return buildable;
}
