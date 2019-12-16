import { use } from '../../src/core/built-in/use';
import { includeTransparentTemplateFnSpecs } from '../spec-helpers/shared-specs';

describe('use', () => {
  includeTransparentTemplateFnSpecs('use', use, {});
});
