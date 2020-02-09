import { attach } from '../../../src/attached-fns';
import { createBuildable } from '../../../src/buildable';

describe('attach', () => {
  it('should set the property with specified value', () => {
    // arrange
    const buildable = createBuildable(null);
    const property = 'some-property';
    const value = 42;

    // act
    attach(property, value)(buildable);

    // assert
    expect(buildable.attachedProperties[property]).toBe(value);
  });

  it('should return the buildable value untouched', () => {
    // arrange
    const obj = {};
    const buildable = createBuildable(obj);

    // act
    attach('property', 'value')(buildable);

    // assert
    expect(buildable.value).toBe(obj);
  });
});
