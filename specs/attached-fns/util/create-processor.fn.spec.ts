import { createProcessorFn, ExecutionTime, ReadType } from '../../../src/attached-fns';
import { MutationFnReadType, TimeOfExecution, Types } from '../../../src/constants';
import { FnFactorySpecs } from '../../spec-helpers/shared-specs';

describe('createProcessorFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createProcessorFn, Types.ProcessorFn);

  (['prebuild', 'postbuild'] as ExecutionTime[]).forEach(timeOfExecution => {
    it('should return a function with TimeOfExecution symbol set', () => {
      // arrange
      const fn = () => {};

      // act
      const result = createProcessorFn(fn, timeOfExecution);

      // assert
      expect(result[TimeOfExecution]).toBe(timeOfExecution);
    });

    it('should set the "value" read-type if nothing passed in as read-type-parameter', () => {
      // arrange
      const input = () => {};
      const expectedValue: ReadType = 'value';

      // act
      const valueFn = createProcessorFn(input, timeOfExecution);

      // assert
      expect(valueFn[MutationFnReadType]).toBeDefined(expectedValue);
    });

    it('should set the given read-type if passed in as read-type-parameter', () => {
      // arrange
      const input = () => {};
      const expectedValue: ReadType = 'buildable';

      // act
      const valueFn = createProcessorFn(input, timeOfExecution, expectedValue);

      // assert
      expect(valueFn[MutationFnReadType]).toBeDefined(expectedValue);
    });
  });
});
