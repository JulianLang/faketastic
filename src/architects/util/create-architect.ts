import { ObjectTreeNode } from 'treelike';
import { ArchitectFnSymbol, BuildCycle } from '../../core';
import { Func } from '../../types';
import { setSymbol } from '../../util';
import { ArchitectFn } from '../types';

/**
 * Creates a new `ArchitectFn`. `ArchitectFn`s are tree-structure mutating functions that gets
 * executed just before all processors. They change the tree-structure and might rearrange processors
 * on affected nodes. However, most likely, they will never touch any *values* on nodes, as they only
 * change the tree-structure, not its node-data.
 * @param fn The function to convert into an ArchitectFn.
 */
export function createArchitectFn(fn: Func<[ObjectTreeNode], void>): ArchitectFn {
  const cycle: BuildCycle = 'initializer';
  return setSymbol(ArchitectFnSymbol, fn as any, cycle);
}
