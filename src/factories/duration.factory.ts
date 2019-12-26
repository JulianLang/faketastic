import moment from 'moment';
import { randomDate } from '../core';
import { isArray } from '../util';

type TimeUnit = 'hours' | 'minutes' | 'seconds';
type DurationInput = [number, TimeUnit];

export function duration(
  baseDate: Date,
  minDuration: DurationInput,
  maxDuration: DurationInput = [2, 'hours'],
): Date | null {
  try {
    const min = getDurationAndFormat(minDuration);
    const max = getDurationAndFormat(maxDuration);

    const durationMin = moment.duration(min.duration, min.unit);
    const durationMax = moment.duration(max.duration, max.unit);
    const minDate = moment(baseDate)
      .add(durationMin)
      .toDate();
    const maxDate = moment(baseDate)
      .add(durationMax)
      .toDate();

    return randomDate(minDate, maxDate);
  } catch {
    return null;
  }
}

function getDurationAndFormat(input: DurationInput) {
  let unit: TimeUnit = 'hours';
  let duration = 2;

  if (isArray(input)) {
    duration = input[0];

    if (input.length >= 2) {
      unit = input[1];
    }
  }

  return { duration, unit };
}
