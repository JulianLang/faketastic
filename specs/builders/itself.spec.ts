import { build, itself, template } from '../../src';

fdescribe('self builder', () => {
  it('should throw if used without parent template', () => {
    // arrange
    const buildable = itself(() => ({ continue: true }));

    // act, assert
    expect(() => build(buildable)).toThrowMatching((err: Error) => err.message.includes('root'));
  });

  fit('should find root template, even when nested', () => {
    // arrange
    let i = 0;
    const tmpl = template({
      level1: {
        level2: itself(() => {
          const breakRecursion = i++ === 1;
          return breakRecursion ? { endWithValue: null } : { continue: true };
        }),
      },
    });

    // act
    const result = build(tmpl);

    // assert
    expect(result).toBeDefined();
    expect(result.level1).toBeDefined();
    expect(result.level1.level2).toBeDefined();
    expect(result.level1.level2.level1).toBeDefined();
    expect(result.level1.level2.level1.level2).toEqual(null);
  });
});
