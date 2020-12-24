import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';

import moment from 'moment';
import 'moment/locale/it';

moment.locale('it');

const SpecificFilterArray = ({
  id,
  placeholder = '',
  value,
  values,
  label,
  setFilters,
}) => (
  <div id={`advanced-filter-array-${id}`}>
    <label htmlFor={id}>{label}</label>
    <Select
      id={id}
      options={values}
      isMulti={true}
      isClearable={true}
      placeholder={placeholder}
      value={values.filter(option =>
        value ? value.query.includes(option.value) : false,
      )}
      aria-controls="sitesearch-results-list"
      onChange={option => {
        if (!option || option.length == 0) {
          setFilters({ [id]: '' });
        } else {
          setFilters({
            [id]: {
              query: option.map(({ value }) => value),
              operator: 'and',
            },
          });
        }
      }}
    />
  </div>
);

SpecificFilterArray.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.any.isRequired,
  values: PropTypes.array.isRequired,
  label: PropTypes.string,
  setFilters: PropTypes.func,
};

const SpecificFilterDate = ({ id, label = '', value, setFilters }) => (
  <div id={`advanced-filter-date-${id}`}>
    <label htmlFor={id}>{label}</label>
    <DayPickerInput
      id={id}
      formatDate={formatDate}
      value={value}
      parseDate={parseDate}
      placeholder={`${formatDate(new Date())}`}
      onDayChange={selectedDay => {
        setFilters({
          [id]: selectedDay,
        });
      }}
      aria-controls="sitesearch-results-list"
      dayPickerProps={{
        locale: 'it',
        localeUtils: MomentLocaleUtils,
      }}
    />
  </div>
);

SpecificFilterDate.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.any,
  setFilters: PropTypes.func.isRequired,
};

const SpecificFilterDateRange = ({ id, start, end, filters, setFilters }) => {
  const [rangeStart, setRangeStart] = React.useState(
    filters.start ? filters.start : null,
  );
  const [rangeEnd, setRangeEnd] = React.useState(
    filters.end ? filters.end : null,
  );

  React.useEffect(() => {
    const date_fmt = 'YYYY-MM-DD HH:mm';

    let filters = {};
    if (rangeStart) {
      let start = moment(rangeStart)
        .startOf('day')
        .format(date_fmt);
      let end = rangeEnd
        ? moment(rangeEnd)
          .endOf('day')
          .format(date_fmt)
        : null;

      if (start && end) {
        filters.start = {
          operator: 'plone.app.querystring.operation.date.between',
          query: [start, end],
        };
      } else {
        filters.start = {
          operator: 'plone.app.querystring.operation.date.largerThan',
          query: start,
        };
      }
    }

    if (rangeEnd) {
      let end = moment(rangeEnd)
        .endOf('day')
        .format(date_fmt);
      let start = rangeStart
        ? moment(rangeStart)
          .startOf('day')
          .format(date_fmt)
        : null;

      if (start && end) {
        filters.end = {
          operator: 'plone.app.querystring.operation.date.between',
          query: [start, end],
        };
      } else {
        filters.end = {
          operator: 'plone.app.querystring.operation.date.lessThan',
          query: end,
        };
      }
    }

    console.dir(filters);
    setFilters(filters);
  }, [rangeStart, rangeEnd]);

  return (
    <React.Fragment>
      <div id={`advanced-filter-date-${id}-start`}>
        <label htmlFor="date-start">{start.label}</label>
        <DayPickerInput
          id="date-start"
          formatDate={formatDate}
          parseDate={parseDate}
          value={rangeStart}
          placeholder={`${formatDate(new Date())}`}
          onDayChange={setRangeStart}
          dayPickerProps={{
            locale: 'it',
            localeUtils: MomentLocaleUtils,
          }}
          aria-controls="sitesearch-results-list"
        />
      </div>
      <div id={`advanced-filter-date-${id}-end`}>
        <label htmlFor="date-end">{end.label}</label>
        <DayPickerInput
          id="date-end"
          formatDate={formatDate}
          parseDate={parseDate}
          value={rangeEnd}
          placeholder={`${formatDate(new Date())}`}
          onDayChange={setRangeEnd}
          dayPickerProps={{
            locale: 'it',
            localeUtils: MomentLocaleUtils,
          }}
          aria-controls="sitesearch-results-list"
        />
      </div>
    </React.Fragment>
  );
};

SpecificFilterDateRange.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.object,
  value: PropTypes.object,
  start: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
  }),
  end: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
  }),
};

const SpecificFilter = ({ type, ...rest }) => {
  if (type === 'date') {
    return <SpecificFilterDate {...rest} />;
  } else if (type === 'array') {
    return <SpecificFilterArray {...rest} />;
  } else if (type === 'date_range') {
    return <SpecificFilterDateRange {...rest} />;
  } else {
    return null;
  }
};

export default SpecificFilter;
