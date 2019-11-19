// import { build, template } from '../../core';
// import { includeBuilderFnSpecs } from '../../core/built-in/specs/shared/shared-specs';
// import { time } from '../time';
// import moment = require('moment');

// describe('time builder function', () => {
//   it('should use todays date and simple time format HH:mm:ss per default', () => {
//     // arrange
//     const Appointment = template({
//       time: time('01:02:03', '14:15:16'),
//     });

//     // act
//     const result = build(Appointment);

//     // assert
//     const resultTime: Date = result.time;
//     const timeAsMoment = moment(resultTime);
//     const startDate = moment().set({
//       hours: 1,
//       minutes: 2,
//       seconds: 3,
//     });
//     const endDate = moment().set({
//       hours: 14,
//       minutes: 15,
//       seconds: 16,
//     });
//     const today = startDate.toDate();

//     expect(resultTime.getDate()).toBe(today.getDate());
//     expect(resultTime.getMonth()).toBe(today.getMonth());
//     expect(resultTime.getFullYear()).toBe(today.getFullYear());
//     expect(timeAsMoment.isSameOrAfter(startDate)).toBe(true);
//     expect(timeAsMoment.isSameOrBefore(endDate)).toBe(true);
//   });

//   it('should use 00:00:00 - 23:59:59 range when parameters are not specified', () => {
//     // arrange
//     const Appointment = template({
//       time: time(),
//     });

//     // act
//     const result = build(Appointment);

//     // assert
//     const timeAsMoment = moment(result.time);
//     const startDate = moment().set({
//       hours: 0,
//       minutes: 0,
//       seconds: 0,
//     });
//     const endDate = moment().set({
//       hours: 23,
//       minutes: 59,
//       seconds: 59,
//     });

//     expect(timeAsMoment.isSameOrAfter(startDate)).toBe(true);
//     expect(timeAsMoment.isSameOrBefore(endDate)).toBe(true);
//   });

//   it('should align default time format to input with missing infos', () => {
//     // arrange
//     const Appointment = template({
//       time: time('12:00', '12:01'),
//     });

//     // act
//     const result = build(Appointment);

//     // assert
//     const startDate = moment()
//       .set({
//         hours: 12,
//         minutes: 0,
//         seconds: 0,
//         milliseconds: 0,
//       })
//       .toDate();
//     const endDate = moment()
//       .set({
//         hours: 12,
//         minutes: 1,
//         seconds: 0,
//         milliseconds: 0,
//       })
//       .toDate();
//     const date: Date = result.time;

//     expect(date >= startDate).toBe(true);
//     expect(date <= endDate).toBe(true);
//   });

//   it('should accept keyword future', () => {
//     // arrange
//     const Appointment = template({
//       time: time('future'),
//     });

//     // act
//     const result = build(Appointment);

//     // assert
//     const now = new Date();
//     expect(now < result.time).toBe(true);
//   });

//   includeBuilderFnSpecs(time, '00:00:00', '00:00:00', {});
// });
