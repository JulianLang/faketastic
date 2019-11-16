import { template } from '../template';
import { includeTransparentTemplateFnSpecs } from './shared/shared-specs';

describe('template statement fn', () => {
  includeTransparentTemplateFnSpecs(template, {});
});
