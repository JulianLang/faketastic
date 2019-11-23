import { ParserFn } from '../../parser/types';

export type DateParserFn = ParserFn<string, string | undefined, Date>;
