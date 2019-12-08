import { ArchitectFn } from '../../architects';
import { AttachedFn } from '../../types';
import { extractFns } from '../../util';
import {
  ArchitectFnSymbol,
  Buildable,
  BuildableSymbol,
  ProcessorFn,
  ProcessorSymbol,
} from '../types';

export function createBuildable<T>(tmpl: T, attachedFns: AttachedFn[] = []): Buildable<T> {
  const buildable: Buildable<any> = {
    [BuildableSymbol]: true,
    processors: extractFns(ProcessorSymbol, attachedFns) as ProcessorFn[],
    architects: extractFns(ArchitectFnSymbol, attachedFns) as ArchitectFn[],
    value: tmpl,
  };

  return buildable;
}
