import { resolveQuantity } from '../../src/attached-fns';

describe('resolveQuantity', () => {
  it('should pass-through numbers', () => {
    // arrange, act, assert
    expect(resolveQuantity(42)).toBe(42);
  });

  it('should execute the function and return its value, when a fn was passed in', () => {
    // arrange
    const calcAmount = () => 42;

    // act, assert
    expect(resolveQuantity(calcAmount)).toBe(42);
  });
});
