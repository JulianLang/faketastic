import { createBuildable, setAttachedProperty } from '../../src/buildable';

describe('setAttachedProperty', () => {
  it('should set the value in the attached properties property of a buildable', () => {
    // arrange
    const expectedValue = {};
    const identifier = 'test-id';
    const buildable = createBuildable(null);

    // act
    setAttachedProperty(identifier, expectedValue, buildable);

    // assert
    expect(buildable.attachedProperties[identifier]).toBe(expectedValue);
  });
});
