import { BuildCycleCallbackFn } from '../../core';
import { MutatingFn } from '../../types';

export interface ArchitectFn extends MutatingFn, BuildCycleCallbackFn {}
