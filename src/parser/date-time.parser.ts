import moment from 'moment';
import { ParserFn } from '../types';
import { isDefined } from '../util';

export const dateTimeParser: ParserFn<string | number | Date, Date> = (
  input: string | number | Date,
  format = 'YYYY/MM/DD HH:mm:ss',
) => {
  try {
    const momentDate = isDefined(format) ? moment(input, format) : moment(input);
    const date = momentDate.toDate();

    return date;
  } catch {
    throw new Error(`faketastic: dateTimeParser: Could not parse "${input}" as date "${format}"`);
  }
};
