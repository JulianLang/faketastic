import { use } from '../../src/core';
import { includeTransparentTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('use', () => {
  includeTransparentTemplateFnSpecs(use, {});
});
