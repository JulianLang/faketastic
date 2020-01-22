import { clone } from '../../src/util';

function testCloning(value: any, type: string) {
  it(`should clone the given ${type}`, () => {
    // arrange, act
    const cloned = clone(value);

    // assert
    expect(cloned).toEqual(value);
    expect(cloned).not.toBe(value);
  });
}

describe('clone', () => {
  testCloning({ a: 42, b: () => {} }, 'object');
  testCloning([{ a: 42, b: () => {} }], 'array');
});
