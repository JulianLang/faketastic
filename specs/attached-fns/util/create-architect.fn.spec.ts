import { createArchitectFn, ReadType } from '../../../src/attached-fns';
import { MutationFnReadType, Types } from '../../../src/constants';
import { FnFactorySpecs } from '../../spec-helpers/shared-specs';

describe('createArchitectFn', () => {
  FnFactorySpecs.returnPassedInFnWithTypeSymbol(createArchitectFn, Types.ArchitectFn);

  it('should set the "value" read-type if nothing passed in as read-type-parameter', () => {
    // arrange
    const input = () => {};
    const expectedValue: ReadType = 'value';

    // act
    const valueFn = createArchitectFn(input);

    // assert
    expect(valueFn[MutationFnReadType]).toBeDefined(expectedValue);
  });

  it('should set the given read-type if passed in as read-type-parameter', () => {
    // arrange
    const input = () => {};
    const expectedValue: ReadType = 'buildable';

    // act
    const valueFn = createArchitectFn(input, expectedValue);

    // assert
    expect(valueFn[MutationFnReadType]).toBeDefined(expectedValue);
  });
});
