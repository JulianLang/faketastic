import { cloneItems } from '../../src/util';

describe('cloneArray', () => {
  it('should clone each item', () => {
    // arrange
    const nestedObject = { a: 42 };
    const obj = { nestedObject };
    const nestedArray = [4711];
    const array = [42, 'str', obj, nestedArray];

    // act
    const cloned = cloneItems(array);

    // assert
    expect(cloned).toEqual(array);
    expect(cloned).not.toBe(array);

    expect(cloned[0]).toEqual(42);
    expect(cloned[1]).toEqual('str');

    expect(cloned[2]).toEqual(obj);
    expect(cloned[2]).not.toBe(obj);

    expect(cloned[2].nestedObject).toEqual(nestedObject);
    expect(cloned[2].nestedObject).not.toBe(nestedObject);

    expect(cloned[3]).toEqual(nestedArray);
    expect(cloned[3]).not.toBe(nestedArray);
  });
});
