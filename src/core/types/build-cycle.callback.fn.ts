import { ObjectTreeNode } from 'treelike';
import { Func } from '../../types';

/** The function signature for a build-cycle-callback function. */
export type BuildCycleCallbackFn = Func<[ObjectTreeNode], void>;
