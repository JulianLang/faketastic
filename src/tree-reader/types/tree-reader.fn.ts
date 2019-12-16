import { BuildCycleCallbackFn } from '../../core';
import { AttachedFn } from '../../types';

export interface TreeReaderFn extends AttachedFn, BuildCycleCallbackFn {}
