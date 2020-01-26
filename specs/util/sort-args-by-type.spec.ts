import { createArchitectFn, createProcessorFn, createReaderFn } from '../../src/attached-fns';
import { sortArgsByType } from '../../src/util';

describe('sortArgsByType', () => {
  it('should correctly split args from attached functions', () => {
    // arrange
    const architect = createArchitectFn(() => {});
    const processor = createProcessorFn(() => {}, 'postbuild');
    const reader = createReaderFn(() => {});
    const argList = {
      string: '',
      number: 0,
      bool: false,
      fn: () => {},
      null: null,
      processor,
      architect,
      reader,
    };

    // act
    const { args, attached } = sortArgsByType(argList);

    // assert
    expect(attached).toEqual([processor, architect, reader]);
    expect(args).toEqual({
      string: argList.string,
      number: argList.number,
      bool: argList.bool,
      fn: argList.fn,
      null: argList.null,
    });
  });
});
