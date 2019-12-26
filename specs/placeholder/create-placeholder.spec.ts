import {
  AttachedFn,
  createArchitectFn,
  createProcessorFn,
  createTreeReaderFn,
  getSymbol,
  isBuildable,
} from '../../src';
import { createPlaceholder, PlaceholderSymbol } from '../../src/placeholder';

describe('placeholder', () => {
  it('should create a buildable with PlaceholderSymbol', () => {
    // arrange, act
    const placeholder = createPlaceholder();

    // assert
    expect(isBuildable(placeholder)).toBe(true);
    expect(getSymbol(PlaceholderSymbol, placeholder.value)).toBe(true);
  });

  it('should set the given type-id as value of PlaceholderSymbol', () => {
    // arrange, act
    const expectedTypeId = 'my-type';
    const placeholder = createPlaceholder(expectedTypeId);

    // assert
    expect(getSymbol(PlaceholderSymbol, placeholder.value)).toBe(expectedTypeId);
  });

  it('should set the given content as value of the buildable', () => {
    // arrange, act
    const expectedContent = { a: 42 };
    const placeholder = createPlaceholder('content', expectedContent);

    // assert
    expect(placeholder.value).toBe(expectedContent as any);
  });

  it('should attach the given AttachedFns to the created buildable', () => {
    // arrange, act
    const treeReader = createTreeReaderFn(() => {}, 'initializer');
    const architect = createArchitectFn(() => {}, 'initializer');
    const processor = createProcessorFn(() => {}, 'initializer', 'unsticky');

    const attachedFns: AttachedFn[] = [treeReader, architect, processor];
    const placeholder = createPlaceholder('content', {}, attachedFns);

    // assert
    expect(placeholder.treeReaders).toEqual([treeReader]);
    expect(placeholder.architects).toEqual([architect]);
    expect(placeholder.processors).toEqual([processor]);
  });

  it('should set an empty object as default content', () => {
    // arrange, act
    const placeholder = createPlaceholder();

    // assert
    expect(placeholder.value).toEqual({} as any);
  });
});
