import { Buildable } from './buildable';

/**
 * Gets the value for the specified attached property on the given buildable.
 * @param identifier The identifier of the attached property to get the value from.
 * @param buildable The buildable to get the attached property from.
 */
export function getAttachedProperty(identifier: string, buildable: Buildable): any {
  return buildable?.attachedProperties?.[identifier];
}
