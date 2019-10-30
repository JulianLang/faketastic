import { use } from '../use';
import {
  includeDirectiveFnSpecs,
  includeTemplateFnSpecs
} from './shared/shared-specs';

describe('use directive', () => {
  includeDirectiveFnSpecs(use, {});
  includeTemplateFnSpecs(use);
});
