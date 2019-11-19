import moment from 'moment';
import { FormatFn } from '../util/format';

export const dateTimeFormatter: FormatFn<string, Date> = (
  input: string,
  format = 'YYYY/MM/DD HH:mm:ss',
) => {
  try {
    return moment(input, format).toDate();
  } catch {
    throw new Error(
      `faketastic: dateFormatter: Could not interpret "${input}" as date "${format}"`,
    );
  }
};
