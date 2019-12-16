import { createPlaceholder, isPlaceholder, PlaceholderSymbol } from '../../../src/placeholder';

describe('isPlaceholder', () => {
  it('should return true for values having PlaceholderSymbol set', () => {
    // arrange, act, assert
    expect(isPlaceholder({ [PlaceholderSymbol]: true })).toBe(true);
  });

  it('should return true for placeholders with correct type-id', () => {
    // arrange, act
    const typeId = 'my-type';
    const buildable = createPlaceholder(typeId);

    // assert
    expect(isPlaceholder(buildable.value, typeId)).toBe(true);
  });

  it('should return false for placeholders with wrong type-id', () => {
    // arrange, act
    const typeId = 'my-type';
    const buildable = createPlaceholder();

    // assert
    expect(isPlaceholder(buildable.value, typeId)).toBe(false);
  });

  it('should return false for null and undefined', () => {
    // arrange, act, assert
    expect(isPlaceholder(null)).toBe(false);
    expect(isPlaceholder(undefined)).toBe(false);
  });
});
