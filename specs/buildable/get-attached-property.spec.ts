import { createBuildable, getAttachedProperty } from '../../src/buildable';

describe('getAttachedProperty', () => {
  it('should return the value stored in the attached properties property of a buildable', () => {
    // arrange
    const expectedValue = {};
    const identifier = 'test-id';
    const buildable = createBuildable(null);
    buildable.attachedProperties[identifier] = expectedValue;

    // act, assert
    expect(getAttachedProperty(identifier, buildable)).toBe(expectedValue);
  });
});
