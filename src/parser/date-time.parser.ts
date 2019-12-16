import moment from 'moment';
import { isUndefined } from '../util';
import { isValidDate, TimeInput } from '../value-fns';
import { tryParse } from './try-parse.fn';
import { ParserFn } from './types';

type DateTimeParseOpts = { format?: string };

export const dateTimeParser: ParserFn<TimeInput, DateTimeParseOpts, Date> = (
  input: TimeInput,
  opts?: DateTimeParseOpts,
) => {
  const parserFns: ParserFn<TimeInput, DateTimeParseOpts, Date>[] = [fromNumber, withMoment];

  return tryParse(parserFns, input, opts);
};

function fromNumber(input: TimeInput): Date | null {
  if (typeof input !== 'number') {
    return null;
  }

  try {
    const date = new Date(input);

    return isValidDate(date) ? date : null;
  } catch {
    return null;
  }
}

function withMoment(input: TimeInput, opts?: DateTimeParseOpts): Date | null {
  if (isUndefined(opts) || isUndefined(opts.format)) {
    opts = { format: 'YYYY/MM/DD HH:mm:ss' };
  }
  if (isUndefined(input)) {
    return null;
  }

  try {
    const momentDate = moment(input, opts.format);
    const date = momentDate.toDate();

    return date;
  } catch {
    return null;
  }
}
