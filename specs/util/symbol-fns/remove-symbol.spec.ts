import { removeSymbol } from '../../../src';

describe('removeSymbol', () => {
  const TestSymbol = Symbol('test');

  it('should remove the specified symbol from the given value', () => {
    // arrange
    const obj = {
      [TestSymbol]: 42,
    };

    // act
    removeSymbol(TestSymbol, obj);

    // assert
    expect(obj[TestSymbol]).toBeUndefined();
  });
});
