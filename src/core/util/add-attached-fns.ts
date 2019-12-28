import { ArchitectFn } from '../../architects/types/architect.fn';
import { ProcessorFn } from '../../processors/types/processor.fn';
import { TreeReaderFn } from '../../tree-reader/types/tree-reader.fn';
import { AttachedFn } from '../../types/attached.fn';
import { AttachedFnType } from '../../types/attached.fn.type';
import { extractFns } from '../../util/symbol-fns/extract.fns';
import { Buildable } from '../types/buildable';
import { AttachedFnSymbol } from '../types/symbols';

/**
 * Adds the specified AttachedFns to a given buildable.
 * @param attachedFns The AttachedFns to add to the buildable.
 * @param buildable The buildable receiving the AttachedFns.
 */
export function addAttachedFns<T = any>(attachedFns: AttachedFn[], buildable: Buildable<T>) {
  const processors = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'processor',
  ) as ProcessorFn[];
  const architects = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'architect',
  ) as ArchitectFn[];
  const treeReaders = extractFns<symbol, AttachedFnType>(
    AttachedFnSymbol,
    attachedFns,
    'tree-reader',
  ) as TreeReaderFn[];

  buildable.processors.push(...processors);
  buildable.architects.push(...architects);
  buildable.treeReaders.push(...treeReaders);
}
