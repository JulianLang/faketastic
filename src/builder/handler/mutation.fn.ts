import { ArchitectFn, ProcessorFn } from '../../attached-fns';

/** Describes attached functions that actually affect a property value. */
export type MutationFn = ArchitectFn | ProcessorFn;
