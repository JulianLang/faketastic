import { BuildCycleCallbackFn, FnIsStickySymbol } from '../../core/types';
import { MutatingFn } from '../../types';

export interface ProcessorFn extends MutatingFn, BuildCycleCallbackFn {
  [FnIsStickySymbol]: boolean;
}
