import { template } from '../..';
import { includeTransparentTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('template statement fn', () => {
  includeTransparentTemplateFnSpecs(template, {});
});
