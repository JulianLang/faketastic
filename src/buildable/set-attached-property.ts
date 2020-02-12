import { Buildable } from './buildable';

/**
 * Sets the given value on the given buildable under the specified attached property identifer.
 * @param identifier The identifier for the attached property to be set.
 * @param value The value to be set for the attached property.
 * @param buildable The buildable to set the attached property on.
 */
export function setAttachedProperty(identifier: string, value: any, buildable: Buildable): void {
  buildable.attachedProperties[identifier] = value;
}
