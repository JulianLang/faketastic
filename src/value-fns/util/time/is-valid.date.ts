/** Determines whether a given value is a valid `Date`. */
export function isValidDate(date: Date) {
  return !isNaN(date as any);
}
