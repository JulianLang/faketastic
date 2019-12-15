import { ArchitectFn } from '../architects';
import { ProcessorFn } from '../processors';

export type MutatingFn = ProcessorFn | ArchitectFn;
