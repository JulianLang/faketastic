import { ExecutionTime, isProcessorFn } from '../../src/attached-fns';
import { TimeOfExecution, Type, Types } from '../../src/constants';

describe('isProcessorFn', () => {
  it('should return true if the type matches', () => {
    // arrange
    const value: any = { [Type]: Types.ProcessorFn };

    // act
    const result = isProcessorFn(value);

    // assert
    expect(result).toBe(true);
  });

  it('should return false if the type does not match', () => {
    // arrange
    const value: any = { [Type]: 'other-type' };

    // act
    const result = isProcessorFn(value);

    // assert
    expect(result).toBe(false);
  });

  it('should return false if the value does not have a type-identifier', () => {
    // arrange
    const value: any = {};

    // act
    const result = isProcessorFn(value);

    // assert
    expect(result).toBe(false);
  });

  it('should return false if the value is null or undefined', () => {
    // arrange, act, assert
    const nullValue: any = null;
    const undefinedValue: any = undefined;

    expect(isProcessorFn(nullValue)).toBe(false);
    expect(isProcessorFn(undefinedValue)).toBe(false);
  });

  it('should return true if the time of execution matches', () => {
    // arrange
    const expectedTimeOfExecution: ExecutionTime = 'postbuild';
    const value: any = {
      [Type]: Types.ProcessorFn,
      [TimeOfExecution]: expectedTimeOfExecution,
    };

    // act
    const result = isProcessorFn(value, expectedTimeOfExecution);

    // assert
    expect(result).toBe(true);
  });

  it('should return true if the time of execution matches', () => {
    // arrange
    const expectedTimeOfExecution: ExecutionTime = 'postbuild';
    const wrongTimeOfExecution: ExecutionTime = 'prebuild';
    const value: any = {
      [Type]: Types.ProcessorFn,
      [TimeOfExecution]: expectedTimeOfExecution,
    };

    // act
    const result = isProcessorFn(value, wrongTimeOfExecution);

    // assert
    expect(result).toBe(false);
  });
});
