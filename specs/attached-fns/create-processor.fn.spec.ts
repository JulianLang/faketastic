import { createProcessorFn, ExecutionTime } from '../../src/attached-fns';
import { TimeOfExecution, Types } from '../../src/constants';
import { FnFactorySpecs } from '../spec-helpers/shared-specs';

describe('createProcessorFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createProcessorFn, Types.ProcessorFn);

  it('should return a function with TimeOfExecution symbol set', () => {
    // arrange
    const timeOfExecution: ExecutionTime = 'postbuild';
    const fn = () => {};

    // act
    const result = createProcessorFn(fn, timeOfExecution);

    // assert
    expect(result[TimeOfExecution]).toBe(timeOfExecution);
  });
});
