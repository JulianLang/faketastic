import { build, Buildable, map, template } from './src';
import { time } from './src/builders/time';

const toUtcString = (v: Buildable<Date>) =>
  v.value.toLocaleTimeString(undefined, { hour12: false });

const Appointment = template({
  // any time from 00:00:00 to 23:59:59
  t1: time(map(toUtcString)),
  // exact date and time now
  t2: time('now', undefined, map(toUtcString)),
  // exact time: 13:32:00
  t3: time('13:32:00', undefined, map(toUtcString)),
  // exact time: 13:32:00
  t4: time(['13:32:00', 'HH:mm:ss'], undefined, map(toUtcString)),
  // any from 12:00:00 to 13:00:00, today
  t5: time('12:00:00', '13:00', map(toUtcString)),
  // any from 12:00:00 to 13:00:00, today
  t6: time(['12:10:10', 'HH:mm:ss'], ['19:24', 'HH:mm'], map(toUtcString)),
  // any from now to 23:59:59, today
  t7: time(new Date(), null, map(toUtcString)),
  // any from 11:00:00 to 23:59:59, today
  t8: time('11:00', null, map(toUtcString)),
  // any from 00:00:00 to 04:00:00, today
  t9: time(null, '04:00', map(toUtcString)),
});

const result = build(Appointment);
console.log(result);
