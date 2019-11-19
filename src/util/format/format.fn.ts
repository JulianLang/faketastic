export type FormatFn<T, K = T> = (input: T, ...params: any[]) => K;
