import { ParserFn } from './parser.fn';

export type DateParserFn = ParserFn<string, string | undefined, Date>;
