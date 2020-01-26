import { AttachedFn, Func } from '../types';

/** Builds a given input into another output format. */
export type BuilderFn<T = any> = Func<[any, AttachedFn[]?], T>;
