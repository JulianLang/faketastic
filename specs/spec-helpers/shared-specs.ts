import { Type } from '../../src/constants';
import { AnyFn, Func } from '../../src/types';

type TypeCheckFn = Func<[any, string], boolean>;
type FnFactory = Func<[AnyFn, any?], Record<typeof Type, string>>;

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

export const FnFactorySpecs = {
  returnPassedInFnWithTypeSymbol: (fn: FnFactory, type: string) =>
    it(`should return the passed-in function with the Type symbol set to "${type}"`, () => {
      // arrange
      const input = () => {};

      // act
      const valueFn = fn(input);

      // assert
      expect(valueFn[Type]).toBe(type);
    }),
};
