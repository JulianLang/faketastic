import { use } from '../use';
import { includeDirectiveFnSpecs, includeTransparentTemplateFnSpecs } from './shared/shared-specs';

describe('use directive', () => {
  includeDirectiveFnSpecs(use, {});
  includeTransparentTemplateFnSpecs(use);
});
