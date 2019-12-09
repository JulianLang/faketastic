import { ArchitectFn } from '../architects/types/architect.fn';
import { ProcessorFn } from '../core/types/processor.fn';
import { ReadonlyFn } from '../readonly';

/** AttachedFns are supported functions to be placed within a TemplateFn or DirectiveFn. */
export type AttachedFn = ProcessorFn | ArchitectFn | ReadonlyFn;
