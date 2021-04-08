import React from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
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
  placeholder,
  value,
  options = [],
  label,
  setFilters,
  translations,
  multivalued = true,
}) => (
  <div id={`advanced-filter-array-${id}`}>
    <label htmlFor={id}>{label}</label>
    <Select
      id={id}
      options={options.filter(opt => opt.value && opt.value !== '')}
      isMulti={multivalued}
      isClearable={true}
      placeholder={
        placeholder ? placeholder : translations['select_placeholder']
      }
      value={options.filter(option =>
        value
          ? value.query.includes(option.value) ||
            value.query.includes(option.label)
          : false,
      )}
      components={{
        // eslint-disable-next-line react/display-name
        MultiValueLabel: props => (
          <components.MultiValueLabel {...props} className="text-primary" />
        ),
      }}
      aria-controls="sitesearch-results-list"
      onChange={option => {
        if (!option || option.length == 0) {
          if (id === 'stato_bandi') {
            setFilters({
              chiusura_procedimento_bando: null,
              scadenza_bando: null,
              [id]: '',
            });
          } else {
            setFilters({ [id]: '' });
          }
        } else if (id === 'stato_bandi') {
          setFilters({
            [id]: {
              query: option.label,
            },
            chiusura_procedimento_bando: null,
            scadenza_bando: null,
            ...option.value,
          });
        } else if (multivalued) {
          setFilters({
            [id]: {
              query: option.map(({ value }) => value),
              operator: 'and',
            },
          });
        } else {
          setFilters({
            [id]: {
              query: option.value,
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
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  setFilters: PropTypes.func,
  translations: PropTypes.object,
  multivalued: PropTypes.bool,
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
  translations: PropTypes.object,
};

const date_fmt = 'YYYY-MM-DD HH:mm';

const getDateFromQuery = (filter, index) => {
  if (!filter) return null;

  const date =
    filter.query && Array.isArray(filter.query)
      ? filter.query[index]
      : filter.query;

  console.log(moment(date));
  return moment(date);
};

const SpecificFilterDateRange = ({
  id,
  start,
  end,
  filters,
  setFilters,
  translations,
}) => {
  const [rangeStart, setRangeStart] = React.useState(
    getDateFromQuery(filters.start, 0),
  );
  const [rangeEnd, setRangeEnd] = React.useState(
    getDateFromQuery(filters.end, 1),
  );

  React.useEffect(() => {
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
          range: 'min:max',
          query: [start, end],
        };
      } else {
        filters.start = {
          range: 'min',
          query: start,
        };
      }
    } else {
      filters.start = null;
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
          range: 'min:max',
          query: [start, end],
        };
      } else {
        filters.end = {
          range: 'max',
          query: end,
        };
      }
    } else {
      filters.end = null;
    }

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
          value={rangeStart ? moment(rangeStart).format('DD/MM/YYYY') : null}
          placeholder={`${formatDate(new Date())}`}
          onDayChange={setRangeStart}
          dayPickerProps={{
            locale: 'it',
            localeUtils: MomentLocaleUtils,
          }}
          todayButton={
            translations['datepicker_today_button']
              ? translations['datepicker_today_button']
              : 'Oggi'
          }
          aria-controls="sitesearch-results-list"
        />
      </div>
      <div id={`advanced-filter-date-${id}-end`}>
        <label htmlFor="date-end">{end.label}</label>
        <DayPickerInput
          id="date-end"
          formatDate={formatDate}
          parseDate={parseDate}
          value={rangeEnd ? moment(rangeEnd).format('DD/MM/YYYY') : null}
          placeholder={`${formatDate(new Date())}`}
          onDayChange={setRangeEnd}
          dayPickerProps={{
            locale: 'it',
            localeUtils: MomentLocaleUtils,
          }}
          todayButton={
            translations['datepicker_today_button']
              ? translations['datepicker_today_button']
              : 'Oggi'
          }
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
  translations: PropTypes.object,
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
  } else if (type === 'array' || type === 'select') {
    return (
      <SpecificFilterArray
        {...rest}
        options={rest.options.filter(opt => opt.value && opt.value !== '')}
      />
    );
  } else if (type === 'date_range') {
    return <SpecificFilterDateRange {...rest} />;
  } else {
    return null;
  }
};

export default SpecificFilter;
