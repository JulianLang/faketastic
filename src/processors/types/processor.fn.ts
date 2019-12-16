import { FnIsStickySymbol } from '../../core/types';
import { BuildCycleCallbackFn, MutatingFn } from '../../types';

export interface ProcessorFn extends MutatingFn, BuildCycleCallbackFn {
  [FnIsStickySymbol]: boolean;
}
