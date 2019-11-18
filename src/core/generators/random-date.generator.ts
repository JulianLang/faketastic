// see: https://stackoverflow.com/a/31379050/3063191
export function randomDate(start: Date, end: Date, startHour = 0, endHour = 23): Date {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const time = startTime + Math.random() * (endTime - startTime);
  const date = new Date(time);

  return date;
}
