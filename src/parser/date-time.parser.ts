import moment from 'moment';
import { ParserFn } from '../util';

export const dateTimeParser: ParserFn<string, Date> = (
  input: string,
  format = 'YYYY/MM/DD HH:mm:ss',
) => {
  try {
    return moment(input, format).toDate();
  } catch {
    throw new Error(`faketastic: dateTimeParser: Could not parse "${input}" as date "${format}"`);
  }
};
