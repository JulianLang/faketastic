import { ObjectTreeNode } from 'treelike';
import { Func } from './func';

/** The function signature for a build-cycle-callback function. */
export type BuildCycleCallbackFn = Func<[ObjectTreeNode], void>;
