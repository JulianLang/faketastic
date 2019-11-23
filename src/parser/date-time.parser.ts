import moment from 'moment';
import { TimeInput } from '../builders/types';
import { isDefined, isUndefined } from '../util';
import { ParserFn } from './types';

export const dateTimeParser: ParserFn<string | number | Date, Date> = (
  input: string | number | Date,
  format = 'YYYY/MM/DD HH:mm:ss',
) => {
  const parserFns: Function[] = [fromNumber, withMoment];

  for (const parser of parserFns) {
    const result = parser(input, format);

    if (isDefined(result)) {
      return result;
    }
  }

  return null;
};

function fromNumber(input: TimeInput): Date | null {
  if (typeof input !== 'number') {
    return null;
  }

  try {
    const date = new Date(input);
    const timestamp = date.getTime();
    const isValid = timestamp > 0;

    return isValid ? date : null;
  } catch {
    return null;
  }
}

function withMoment(input: TimeInput, format?: string): Date | null {
  if (isUndefined(format)) {
    format = 'YYYY/MM/DD HH:mm:ss';
  }
  if (isUndefined(input)) {
    return null;
  }

  try {
    const momentDate = isDefined(format) ? moment(input, format) : moment(input);
    const date = momentDate.toDate();

    return date;
  } catch {
    throw new Error(`faketastic: dateTimeParser: Could not parse "${input}" as date "${format}"`);
  }
}
