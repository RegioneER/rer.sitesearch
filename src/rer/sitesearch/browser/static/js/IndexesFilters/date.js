import React, { useContext, useState, useEffect } from 'react';
import SearchContext from '../utils/searchContext';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, {
  formatDate,
  parseDate,
} from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';

import moment from 'moment';
import 'moment/locale/it';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

moment.locale('it');

const { faTimes } = icons;
const date_fmt = 'YYYY-MM-DD HH:mm';
const DateField = ({ filters, index, setFilters }) => {
  const { translations } = useContext(SearchContext);
  const getDateFromQuery = index => {
    const indexValue = filters[index];
    if (!indexValue) {
      return null;
    }
    const date =
      indexValue.query && Array.isArray(indexValue.query)
        ? indexValue.query[index]
        : indexValue.query;

    return moment(date);
  };

  const [rangeStart, setRangeStart] = useState(getDateFromQuery(0));
  const [rangeEnd, setRangeEnd] = useState(getDateFromQuery(1));

  useEffect(() => {
    let dateFilters = {};
    let start = rangeStart
      ? moment(rangeStart)
          .startOf('day')
          .format(date_fmt)
      : null;
    let end = rangeEnd
      ? moment(rangeEnd)
          .endOf('day')
          .format(date_fmt)
      : null;

    if (start && end) {
      dateFilters = {
        range: 'min:max',
        query: [start, end],
      };
    } else if (start && !end) {
      dateFilters = {
        range: 'min',
        query: start,
      };
    } else if (end && !start) {
      dateFilters = {
        range: 'max',
        query: end,
      };
    } else {
      dateFilters = null;
    }

    setFilters({ [index]: dateFilters });
  }, [rangeStart, rangeEnd]);

  return (
    <React.Fragment>
      <div className="rer-sitesearch-date" id={`advanced-filter-date-${index}`}>
        <label htmlFor="date-start-label">{translations.from}</label>
        <div className="date-wrapper">
          <DayPickerInput
            id="date-start"
            formatDate={formatDate}
            parseDate={parseDate}
            value={rangeStart ? moment(rangeStart).format('DD/MM/YYYY') : null}
            placeholder=""
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
          <button type="button" onClick={() => setRangeStart(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <div className="rer-sitesearch-date" id={`advanced-filter-date-${index}`}>
        <label htmlFor="date-end-label">{translations.to}</label>
        <div className="date-wrapper">
          <DayPickerInput
            id="date-end"
            formatDate={formatDate}
            parseDate={parseDate}
            value={rangeEnd ? moment(rangeEnd).format('DD/MM/YYYY') : null}
            placeholder=""
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
          <button type="button" onClick={() => setRangeEnd(null)}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

DateField.propTypes = {
  filters: PropTypes.object,
  index: PropTypes.string,
  setFilters: PropTypes.func,
};

export default DateField;
