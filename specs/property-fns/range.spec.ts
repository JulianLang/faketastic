import { createBuildable } from '../../src/buildable';
import AttachedProperties from '../../src/constants/attached.properties';
import { range } from '../../src/property-fns';
import * as spyable from '../../src/value-fns';

describe('range', () => {
  it('should call the randomInt-implementation when no "strategy" attached-property is set', () => {
    // arrange
    const buildable = createBuildable({});
    spyOn(spyable, 'randomInt');

    // act
    range(1, 10).value(buildable);

    // assert
    /*
        Note: this expectations depend on the import path being an exact
        match to the import path in the implementation file (range.ts).
    */
    expect(spyable.randomInt).toHaveBeenCalledTimes(1);
    expect(spyable.randomInt).toHaveBeenCalledWith(1, 10);
  });

  it('should call the custom implementation of set in "strategy" attached-property', () => {
    // arrange
    const buildable = createBuildable({});
    const spy = jasmine.createSpy('impl');
    buildable.attachedProperties[AttachedProperties.range.strategy] = spy;

    // act
    range(1, 10).value(buildable);

    // assert
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1, 10);
  });
});
