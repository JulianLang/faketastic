import { Buildable, createBuildable } from '../buildable';
import { clone } from '../util';

/**
 * Creates a new buildable model that can be built by faketastic.
 * @param mdl The model's content. This is what the model describes.
 * @returns A new buildable model describing the specified content.
 */
export function model<T = any>(mdl: any): Buildable<T> {
  const clonedTemplate = clone(mdl);

  return createBuildable(clonedTemplate);
}
