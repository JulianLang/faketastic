import { canBe } from '../../../src/attached-fns';

fdescribe('canBe', () => {
  it('should return the alternative value when the processor applies', () => {
    // arrange
    const value = 42;
    const processor = canBe(value, 1);

    // act
    const result = processor(0);

    // assert
    expect(result).toBe(value);
  });

  it('should return the original value when the processor does not apply', () => {
    // arrange
    const original = {};
    const processor = canBe(null, 0);

    // act
    const result = processor(original);

    // assert
    expect(result).toBe(original);
  });
});
