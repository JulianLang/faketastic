import { Buildable } from '../../buildable';
import { createProcessorFn } from '../util/create-processor.fn';

export function attach(property: string, value: any) {
  function attachProperty(buildable: Buildable) {
    buildable.attachedProperties[property] = value;

    return buildable.value;
  }

  return createProcessorFn(attachProperty, 'prebuild', 'buildable');
}
