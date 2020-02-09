import { oneOf } from '../../src/property-fns';
import { PropertyFnEndToEndSpecs } from '../spec-helpers/shared-specs';

describe('oneOf: e2e', () => {
  PropertyFnEndToEndSpecs.cloneInputToAvoidSideEffectsWithQuantity(() => {
    const item = { b: 4711 };

    return { buildable: oneOf([item]), item };
  });
});
