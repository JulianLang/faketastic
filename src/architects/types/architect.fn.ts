import { BuildCycleCallbackFn, MutatingFn } from '../../types';

export interface ArchitectFn extends MutatingFn, BuildCycleCallbackFn {}
