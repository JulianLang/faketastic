import { ArchitectFn, ProcessorFn, ReaderFn } from '../attached.fn';
import { isArchitectFn } from './is-architect.fn';
import { isProcessorFn } from './is-processor.fn';
import { isReaderFn } from './is-reader.fn';

/**
 * Determines whether a given value is an `AttachedFn`.
 * @param fn The function to be checked if it is an `AttachedFn`.
 * @returns `true` if the given value is an `AttachedFn`, `false` otherwise.
 */
export function isAttachedFn(fn: any): fn is ProcessorFn | ArchitectFn | ReaderFn {
  return isProcessorFn(fn) || isArchitectFn(fn) || isReaderFn(fn);
}
