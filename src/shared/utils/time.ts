import { format } from 'date-fns/fp/format';

export enum DateFormat {
  FullDayName = 'EEEE',
  DayMonthYear = 'dd MMMM yyyy',
  HourMinute = 'HH:mm',
  DayMonth = 'd MMM',
}

export const ensureUtcOffset = (time: string) => {
  if (time.endsWith('Z')) {
    return time;
  } else if (time.includes('T')) {
    return `${time}Z`;
  } else {
    return `${time}T00:00:00Z`;
  }
};

export const formatDate = (date: string, dateFormat: DateFormat) => {
  return format(dateFormat, new Date(date));
};
