import { canBe } from '../../../src/attached-fns';
import { createBuildable } from '../../../src/buildable';
import AP from '../../../src/constants/attached.properties';
import { AttachedPropertySpecs } from '../../spec-helpers/shared-specs';

describe('canBe', () => {
  AttachedPropertySpecs.retrieveImplementationFromAttachedProperty(
    /** target */ canBe(null),
    /** retrieves from */ AP.strategies.probability,
    /** ...expected args */ 0.5,
  );

  it('should return the alternative value when the processor applies', () => {
    // arrange
    const value = 42;
    const anyValue = 0;
    const buildable = createBuildable(anyValue);

    // act
    const result = canBe(value, 1)(buildable);

    // assert
    expect(result).toBe(value);
  });

  it('should return the original value when the processor does not apply', () => {
    // arrange
    const original = {};
    const buildable = createBuildable(original);
    const anyValue = 0;

    // act
    const result = canBe(anyValue, 0)(buildable);

    // assert
    expect(result).toBe(original);
  });
});
