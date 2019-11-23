import { clone } from './clone';

/** Makes every (object based) item unique by cloning the value. */
export function cloneItems(array: any[]): any[] {
  return array.map(value => clone(value));
}
