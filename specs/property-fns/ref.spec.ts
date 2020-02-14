import { createNode, ObjectTreeNode } from 'treelike';
import { createBuildable, setAttachedProperty } from '../../src/buildable';
import { Types } from '../../src/constants';
import AP from '../../src/constants/attached.properties';
import { ref } from '../../src/property-fns';
import { isType } from '../../src/util';

describe('ref', () => {
  it('should store a reference function inside its host buildable', () => {
    // arrange
    const parent = createNode('parent', null);
    const buildable = createBuildable(null);
    const node = createNode('host', buildable, [], parent);
    const readerFn = ref('parent').attachedFns[0];

    // act
    readerFn(node);

    // assert
    const refFn = buildable.value;
    expect(refFn).toBeDefined();
    expect(typeof refFn).toBe('function');
    expect(isType(Types.ReferenceFn, refFn)).toBe(true);
  });

  it('should store a reference function retrieving the value on call', () => {
    // arrange
    const refValue = 42;
    const parent = createNode('parent', refValue);
    const buildable = createBuildable(null);
    const node = createNode('host', buildable, [], parent);
    const readerFn = ref('parent').attachedFns[0];

    // act
    readerFn(node);

    // assert
    const refFn = buildable.value;
    expect(refFn()).toBe(refValue);
  });

  it('should retrieve the raw reference-value', () => {
    // arrange
    const rawValue = 42;
    const refValue = createBuildable(rawValue);
    const parent = createNode('parent', refValue);

    const buildable = createBuildable(null);
    const node = createNode('host', buildable, [], parent);
    const readerFn = ref('parent').attachedFns[0];

    // act
    readerFn(node);

    // assert
    const refFn = buildable.value;
    expect(refFn()).toBe(rawValue);
  });

  it('should use the targetSelectorFn attached property', () => {
    // arrange
    const value = 42;
    const parent = createNode('custom', value);
    const buildable = createBuildable(null);
    const node = createNode('host', buildable, [], parent);
    const readerFn = ref('parent').attachedFns[0];

    const customTargetFn = (n: ObjectTreeNode) => n.value === value;
    setAttachedProperty(AP.ref.targetSelector, customTargetFn, buildable);

    // act
    readerFn(node);

    // assert
    const resolveFn = buildable.value;
    expect(resolveFn()).toBe(value);
  });

  it('should use the targetSelectorFn attached property', () => {
    // arrange
    const strategy = jasmine.createSpy('traversingStrategy');
    const buildable = createBuildable(null);
    const node = createNode('host', buildable);
    const readerFn = ref('parent').attachedFns[0];

    setAttachedProperty(AP.ref.traversingStrategy, strategy, buildable);

    // act
    readerFn(node);

    // assert
    expect(strategy).toHaveBeenCalledTimes(1);
  });
});
