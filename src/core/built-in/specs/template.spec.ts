import { template } from '../template';
import {
  includeStatementFnSpecs,
  includeTemplateFnSpecs
} from './shared/shared-specs';

describe('template statement fn', () => {
  includeStatementFnSpecs(template, {});
  includeTemplateFnSpecs(template);
});
