import { cloneItems } from '../../src';

describe('cloneItems', () => {
  it('should make a deep copy of all items', () => {
    // arrange
    const obj1 = {
      a: 42,
      b: new Map().set('b1', 42) as Map<string, number>,
    };
    const obj2 = {
      a: obj1,
      b: new Map().set('b2', 42) as Map<string, number>,
    };
    const array = [obj2];

    // act
    const cloned = cloneItems(array);

    // assert
    const resultObj: typeof obj2 = cloned[0];
    expect(cloned).toBeDefined();
    expect(cloned.length).toBe(1);
    expect(resultObj.a).not.toBe(obj1);
    expect(resultObj.a).toEqual(obj1);

    expect(resultObj.a.b).not.toBe(obj1.b);
    expect(resultObj.a.b).toEqual(obj1.b);
    expect(resultObj.a.b.get('b1')).toBe(42);

    expect(resultObj.b).not.toBe(obj2.b);
    expect(resultObj.b).toEqual(obj2.b);
    expect(resultObj.b.get('b2')).toBe(42);
  });
});
