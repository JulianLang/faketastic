import { tryParse } from '../../src/parser/try-parse.fn';

describe('tryParse', () => {
  it('should call all parsers and return null if none could parse the input', () => {
    // arrange
    const parser1 = jasmine.createSpy('parser1', () => null).and.callThrough();
    const parser2 = jasmine.createSpy('parser2', () => null).and.callThrough();

    // act
    const result = tryParse([parser1, parser2], 'any');

    // assert
    expect(result).toBe(null);
    expect(parser1).toHaveBeenCalledTimes(1);
    expect(parser2).toHaveBeenCalledTimes(1);
  });

  it('should immediately if a parser yielded a value', () => {
    // arrange
    const expectedValue = 42;
    const negativeTest = 1172;
    const parser1 = jasmine.createSpy('parser1', () => null).and.callThrough();
    const parser2 = jasmine.createSpy('parser2', () => expectedValue).and.callThrough();
    const parser3 = jasmine.createSpy('parser3', () => negativeTest).and.callThrough();

    // act
    const result = tryParse([parser1, parser2, parser3], 'any');

    // assert
    expect(result).toBe(expectedValue);
    expect(parser1).toHaveBeenCalledTimes(1);
    expect(parser2).toHaveBeenCalledTimes(1);
    expect(parser3).not.toHaveBeenCalled();
  });

  it('should warn you, if you pass in an empty array for parser functions', () => {
    // arrange
    const consoleSpy = spyOn(console, 'warn');

    // act
    tryParse([], null);

    // assert
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
