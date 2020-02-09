import { Buildable } from '../../buildable';
import { createProcessorFn } from '../util/create-processor.fn';

/**
 * Sets the specified attached property with the given value on the current property's buildable.
 * @param property The attached property identifier to set a value on.
 * @param value The value to be set.
 */
export function attach(property: string, value: any) {
  function attachProperty(buildable: Buildable) {
    buildable.attachedProperties[property] = value;

    return buildable.value;
  }

  return createProcessorFn(attachProperty, 'prebuild', 'buildable');
}
