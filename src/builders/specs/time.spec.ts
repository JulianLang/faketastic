import { isDate } from 'util';
import { build, createProcessorFn, template } from '../../core';
import { time } from '../time';

describe('time builder fn', () => {
  it('should return a time of today if no parameter is given', () => {
    // arrange
    const Appointment = template({
      t: time(),
    });

    // assert
    const result = build(Appointment);

    // act
    expect(isDate(result.t)).toBe(true);
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
    const procFn1 = createProcessorFn(() => {}, 'initializer');
    const procFn2 = createProcessorFn(() => {}, 'initializer');

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
});
