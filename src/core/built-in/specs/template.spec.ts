import { template } from '../template';
import { includeTemplateFnSpecs } from './shared/shared-specs';

describe('template statement fn', () => {
  includeTemplateFnSpecs(template, {});
});
