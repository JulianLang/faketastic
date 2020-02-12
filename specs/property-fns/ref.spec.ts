import { createNode } from 'treelike';
import { createBuildable } from '../../src/buildable';
import { Types } from '../../src/constants';
import AP from '../../src/constants/attached.properties';
import { ref } from '../../src/property-fns';
import { isType } from '../../src/util';

fdescribe('ref', () => {
  it('should store a reference function inside its host buildables attached property', () => {
    // arrange
    const parent = createNode('parent', null);
    const buildable = createBuildable(null);
    const node = createNode('host', buildable, [], parent);
    const readerFn = ref('parent').attachedFns[0];

    // act
    readerFn(node);

    // assert
    const attachedProperty = buildable.attachedProperties[AP.ref.resolvedValue];
    expect(attachedProperty).toBeDefined();
    expect(typeof attachedProperty).toBe('function');
    expect(isType(Types.ReferenceFn, attachedProperty)).toBe(true);
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
    const attachedProperty = buildable.attachedProperties[AP.ref.resolvedValue];
    expect(attachedProperty()).toBe(refValue);
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
    const attachedProperty = buildable.attachedProperties[AP.ref.resolvedValue];
    expect(attachedProperty()).toBe(rawValue);
  });
});
