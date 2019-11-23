import { Nullable } from '../../types';

export type ParserFn<T, K, R> = (input: T, opts?: K) => Nullable<R>;
