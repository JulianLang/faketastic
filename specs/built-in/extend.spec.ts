import { extend } from '../../src/core';
import {
  includeDirectiveFnSpecs,
  includeTransparentTemplateFnSpecs,
} from '../spec-helpers/shared-specs';

describe('extend', () => {
  it('should merge templates', () => {
    // arrange
    const obj1 = {
      a: 12,
      b: 'str',
    };
    const obj2 = {
      c: true,
    };

    // act
    const buildable = extend(obj1, obj2);

    // assert
    const value = buildable.value;
    expect(value.a).toBe(12);
    expect(value.b).toBe('str');
    expect(value.c).toBe(true);
  });

  it('should override base template with extension', () => {
    // arrange
    const obj1 = {
      a: 12,
      b: 'str',
    };
    const obj2 = {
      a: true,
    };

    // act
    const buildable = extend(obj1, obj2);

    // assert
    const value = buildable.value;
    expect(value.a).toBe(true);
    expect(value.b).toBe('str');
  });

  it('should deep copy the extension before applying', () => {
    // arrange
    const obj2 = {
      c: true,
    };
    const obj1 = {
      a: obj2,
    };

    // act
    const buildable = extend({}, obj1);

    // assert
    const value = buildable.value;
    expect(value.a).toEqual(obj2);
    expect(value.a).not.toBe(obj2);
  });

  includeTransparentTemplateFnSpecs(extend, {});
  includeDirectiveFnSpecs(extend, {}, {});
});
