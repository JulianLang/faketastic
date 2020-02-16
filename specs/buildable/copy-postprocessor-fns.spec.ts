import { AttachedFn, createArchitectFn, createProcessorFn } from '../../src/attached-fns';
import { Buildable, copyPostprocessors } from '../../src/buildable';

describe('copyPostprocessorFns', () => {
  it('should copy only postprocessors', () => {
    // arrange
    const architect = createArchitectFn(() => {});
    const postprocessor1 = createProcessorFn(() => {}, 'prebuild');
    const postprocessor2 = createProcessorFn(() => {}, 'postbuild');
    const mockOriginal = { attachedFns: [architect, postprocessor1, postprocessor2] } as Buildable;
    const mockTarget = { attachedFns: [] as AttachedFn[] } as Buildable;

    // act
    copyPostprocessors(mockOriginal, mockTarget);

    // assert
    expect(mockTarget.attachedFns).toEqual([postprocessor2]);
  });

  it('should APPEND the postprocessors of original to target', () => {
    // arrange
    const architect = createArchitectFn(() => {});
    const postprocessor2 = createProcessorFn(() => {}, 'postbuild');
    const mockOriginal = { attachedFns: [postprocessor2] } as Buildable;
    const mockTarget = { attachedFns: [architect] } as Buildable;

    // act
    copyPostprocessors(mockOriginal, mockTarget);

    // assert
    expect(mockTarget.attachedFns).toEqual([architect, postprocessor2]);
  });
});
