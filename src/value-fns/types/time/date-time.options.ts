import { DateParserFn } from './date-parser.fn';

/** Options to be passed to `dateTime` function */
export interface DateTimeOpts {
  startFormat?: string;
  endFormat?: string;
  parserFns?: DateParserFn[];
}
