import { map } from '../map';
import { includeProcessorFnSpecs } from './shared/shared-specs';

describe('map processor fn', () => {
  includeProcessorFnSpecs(map, () => {});
});
