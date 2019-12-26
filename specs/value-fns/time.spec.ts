import { build, createProcessorFn, isDateInstance, template, time } from '../../src';

describe('time', () => {
  it('should return a time of today if no parameter is given', () => {
    // arrange
    const Appointment = template({
      t: time(),
    });

    // act
    const result = build(Appointment);

    // assert
    expect(isDateInstance(result.t)).toBe(true);
    expect(result.t).toBeDefined();
  });

  it('should return current time for now keyword', () => {
    // arrange
    const Appointment = template({
      t: time('now'),
    });

    // assert
    const result = build(Appointment);

    // act
    const now = new Date();
    const resultTime: Date = result.t;
    expect(resultTime.getDate()).toBe(now.getDate());
    expect(resultTime.getMonth()).toBe(now.getMonth());
    expect(resultTime.getFullYear()).toBe(now.getFullYear());
    expect(resultTime.getHours()).toBe(now.getHours());
    expect(resultTime.getMinutes()).toBe(now.getMinutes());
  });

  it('should add the parameter to buidables processors, if they are processor functions', () => {
    // arrange
    const procFn1 = createProcessorFn(() => {}, 'initializer', 'unsticky');
    const procFn2 = createProcessorFn(() => {}, 'initializer', 'unsticky');

    // act
    const buildable = time(procFn1, procFn2);

    // assert
    expect(buildable.processors.length).toBe(2);
    expect(buildable.processors[0]).toBe(procFn1);
    expect(buildable.processors[1]).toBe(procFn2);
  });

  it('should use HH:mm as default format', () => {
    // arrange
    const Appointment = template({
      t: time('14:12'),
    });

    // assert
    const result = build(Appointment);

    // act
    const resultTime: Date = result.t;
    expect(resultTime.getHours()).toBe(14);
    expect(resultTime.getMinutes()).toBe(12);
  });

  it('should accept custom formats', () => {
    // arrange
    const Appointment = template({
      t: time(['02:12 pm', 'hh:mm aa']),
    });

    // assert
    const result = build(Appointment);

    // act
    const resultTime: Date = result.t;
    expect(resultTime.getHours()).toBe(14);
    expect(resultTime.getMinutes()).toBe(12);
  });

  it('should accept custom formats for both parameters', () => {
    // arrange
    const Appointment = template({
      t: time(['02:12 pm', 'hh:mm aa'], ['02:14 pm', 'hh:mm aa']),
    });

    // assert
    const result = build(Appointment);

    // act
    const resultTime: Date = result.t;
    expect(resultTime.getHours()).toBe(14);
    expect(resultTime.getMinutes()).toBeGreaterThanOrEqual(12);
    expect(resultTime.getMinutes()).toBeLessThanOrEqual(14);
  });

  it('should accept null as min-date parameter', () => {
    // arrange
    const Appointment = template({
      t: time(null, ['12:00', 'HH:mm']),
    });

    // assert
    const result = build(Appointment);

    // act
    const resultTime: Date = result.t;
    expect(resultTime.getHours()).toBeLessThanOrEqual(12);
    expect(resultTime.getMinutes()).toBeLessThanOrEqual(59);
  });

  it('should accept null as max-date parameter', () => {
    // arrange
    const Appointment = template({
      t: time(['12:00', 'HH:mm'], null),
    });

    // assert
    const result = build(Appointment);

    // act
    const resultTime: Date = result.t;
    expect(resultTime.getHours()).toBeGreaterThanOrEqual(12);
    expect(resultTime.getMinutes()).toBeGreaterThanOrEqual(0);
  });

  it('should throw for unparsable parameters', () => {
    // arrange
    const buildable1 = time('unparsable');
    const buildable2 = time(new Date(), 'unparsable');

    // act, assert
    expect(() => build(buildable1)).toThrow();
    expect(() => build(buildable2)).toThrow();
  });
});
