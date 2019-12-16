import { randomItem } from '../../src/core/randomizers/random-item.generator';

describe('generators: randomItem', () => {
  it('should return null for an empty array', () => {
    // arrange
    const array: any[] = [];

    // act
    const item = randomItem(array);

    // assert
    expect(item).toBe(null);
  });

  it('should return an item of a non-empty array', () => {
    // arrange
    const item = 1;
    const array: any[] = [item, item];

    // act
    const chosenItem = randomItem(array);

    // assert
    expect(chosenItem).toBe(item);
  });
});
