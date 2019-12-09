import { ArchitectFn } from '../architects';
// TODO: langju: should be moved to processors
import { ProcessorFn } from '../core';
export type MutatingFn = ProcessorFn | ArchitectFn;
