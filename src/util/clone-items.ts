import { clone } from './clone';

/** Makes every (object based) item unique by cloning the value. */
export function cloneItems<T>(array: T[]): T[] {
  return array.map(value => clone(value));
}
