import { randomInt } from './random-int.generator';

export function randomDate(min: Date, max: Date) {
  const year = randomInt(min.getFullYear(), max.getFullYear());
  const month = randomInt(0, 11);
  const day = randomInt(1, 31);
  const hour = randomInt(0, 24);
  const minute = randomInt(0, 60);
  const second = randomInt(0, 60);

  return new Date(year, month, day, hour, minute, second, 0);
}
