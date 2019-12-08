import { ArchitectFn } from '../architects/types/architect.fn';
import { ProcessorFn } from '../core/types/processor.fn';

/** AttachedFns are supported functions to be placed within a TemplateFn or DirectiveFn. */
export type AttachedFn = ProcessorFn | ArchitectFn;
