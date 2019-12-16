import { clone } from '../../src';

describe('clone', () => {
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

    // act
    const cloned = clone(obj2);

    // assert
    expect(cloned).toBeDefined();
    expect(cloned.a).not.toBe(obj1);
    expect(cloned.a).toEqual(obj1);

    expect(cloned.a.b).not.toBe(obj1.b);
    expect(cloned.a.b).toEqual(obj1.b);
    expect(cloned.a.b.get('b1')).toBe(42);

    expect(cloned.b).not.toBe(obj2.b);
    expect(cloned.b).toEqual(obj2.b);
    expect(cloned.b.get('b2')).toBe(42);
  });
});
