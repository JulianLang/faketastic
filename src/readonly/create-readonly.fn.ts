import { ObjectTreeNode } from 'treelike';
import { BuildCycle } from '../core';
import { Func } from '../types';
import { setSymbol } from '../util';
import { ReadonlyFn, ReadonlyFnSymbol } from './types';

/**
 * Creates a new ReadonlyFn from the given function. ReadonlyFn are executed before ArchitectFns and ProcessorFns
 * and must not have an effect on the tree. They are meant to only gather information from the tree, before it
 * gets mutated by the ArchitectFns and ProcessorFns.
 * @param fn The function to be converted into a ReadonlyFn.
 * @param forCycle The build-cycle to run the ReadonlyFn in.
 */
export function createReadonlyFn(
  fn: Func<[ObjectTreeNode], void>,
  forCycle: BuildCycle,
): ReadonlyFn {
  return setSymbol(ReadonlyFnSymbol, fn as ReadonlyFn, forCycle);
}
