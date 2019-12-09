import { TreeReaderFn } from '../tree-reader';
import { MutatingFn } from './mutating.fn';

/** AttachedFns are supported functions to be placed within a TemplateFn or DirectiveFn. */
export type AttachedFn = MutatingFn | TreeReaderFn;
