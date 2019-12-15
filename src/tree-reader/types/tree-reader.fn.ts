import { AttachedFn, BuildCycleCallbackFn } from '../../types';

export interface TreeReaderFn extends AttachedFn, BuildCycleCallbackFn {}
