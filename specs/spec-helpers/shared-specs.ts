import { Type } from '../../src/constants';
import { Func } from '../../src/types';

type TypeCheckFn = Func<[any, string], boolean>;

export const TypeCheckFnSpecs = {
  returnTrueForTypeMatches: (fn: TypeCheckFn, expectedType: string) =>
    it('should return true if the type matches', () => {
      // arrange
      const value = { [Type]: expectedType };

      // act
      const result = fn(value, expectedType);

      // assert
      expect(result).toBe(true);
    }),
  returnFalseForNonMatches: (fn: TypeCheckFn) =>
    it('should return false if the type does not match', () => {
      // arrange
      const expectedType = 'test-type';
      const value = { [Type]: 'other-type' };

      // act
      const result = fn(value, expectedType);

      // assert
      expect(result).toBe(false);
    }),
  returnFalseForValueWithoutType: (fn: TypeCheckFn) =>
    it('should return false if the value does not have a type-identifier', () => {
      // arrange
      const expectedType = 'test-type';
      const value = {};

      // act
      const result = fn(value, expectedType);

      // assert
      expect(result).toBe(false);
    }),
  returnFalseForNonDefined: (fn: TypeCheckFn) =>
    it('should return false if the value is null or undefined', () => {
      // arrange, act, assert
      expect(fn(null, 'type-id')).toBe(false);
      expect(fn(undefined, 'type-id')).toBe(false);
    }),
};
