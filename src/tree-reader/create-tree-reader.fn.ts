import { AttachedFnSymbol, BuildCycle, BuildCycleCallbackFn, FnBuildCycleSymbol } from '../core';
import { AttachedFnType } from '../types';
import { setSymbol } from '../util';
import { TreeReaderFn } from './types';

/**
 * Creates a new TreeReaderFn from the given function. TreeReaderFn are executed before ArchitectFns and ProcessorFns
 * and must not have an effect on the tree. They are meant to only gather information from the tree, before it
 * gets mutated by the ArchitectFns and ProcessorFns.
 * @param fn The function to be converted into a TreeReaderFn.
 * @param forCycle The build-cycle to run the TreeReaderFn in.
 */
export function createTreeReaderFn(fn: BuildCycleCallbackFn, forCycle: BuildCycle): TreeReaderFn {
  const type: AttachedFnType = 'tree-reader';
  const treeReader: TreeReaderFn = setSymbol(AttachedFnSymbol, fn as TreeReaderFn, type);

  return setSymbol(FnBuildCycleSymbol, treeReader, forCycle);
}
