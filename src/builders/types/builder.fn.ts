import { UnsetValue } from '../../constants';
import { Buildable } from '../../core';

export interface BuilderFn {
  (...params: any[]): Buildable<typeof UnsetValue>;
}
