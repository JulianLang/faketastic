import { createBuildable, isBuildable, template } from '../../src/core';
import { includeTransparentTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('template statement fn', () => {
  it('should avoid unnecessarily nested templates', () => {
    // arrange
    const alreadyBuildable = createBuildable({});

    // act
    const buildable = template(alreadyBuildable);

    // assert
    expect(isBuildable(buildable)).toBe(true);
    expect(isBuildable(buildable.value)).toBe(false);
  });

  includeTransparentTemplateFnSpecs(template, {});
});
