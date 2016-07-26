import moment from 'moment';

export const dateUtils = {
  getDateWithoutTime: (dateTime, format = 'DD MMM YY') =>
    (dateTime ? moment(dateTime).format(format) : null),
};
