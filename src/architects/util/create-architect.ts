import {
  AttachedFnSymbol,
  BuildCycle,
  BuildCycleCallbackFn,
  FnBuildCycleSymbol,
  FnOrderSymbol,
} from '../../core';
import { AttachedFnType } from '../../types';
import { setSymbol } from '../../util';
import { ArchitectFn } from '../types';

/**
 * Creates a new `ArchitectFn`. `ArchitectFn`s are tree-structure mutating functions that gets
 * executed just before all processors. They change the tree-structure and might rearrange processors
 * on affected nodes. However, most likely, they will never touch any *values* on nodes, as they only
 * change the tree-structure, not its node-data.
 * @param fn The function to convert into an ArchitectFn.
 */
export function createArchitectFn(
  fn: BuildCycleCallbackFn,
  forCycle: BuildCycle,
  order = 0,
): ArchitectFn {
  const type: AttachedFnType = 'architect';
  const architectFn: ArchitectFn = setSymbol(AttachedFnSymbol, fn as ArchitectFn, type);
  architectFn[FnOrderSymbol] = order;
  architectFn[FnBuildCycleSymbol] = forCycle;

  return architectFn;
}