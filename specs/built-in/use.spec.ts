import { use } from '../../src/core';
import {
  includeDirectiveFnSpecs,
  includeTransparentTemplateFnSpecs,
} from '../spec-helpers/shared-specs';

describe('use directive', () => {
  includeDirectiveFnSpecs(use, {});
  includeTransparentTemplateFnSpecs(use);
});
