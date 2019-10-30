export type PureObject<T extends Object> = T extends Array<any> ? never : T;
