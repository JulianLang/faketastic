export type ParserFn<T, K = T> = (input: T, ...params: any[]) => K;
