import React, { useContext } from 'react';
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

  const getStartValue = () => {
    const indexValue = filters[index];
    if (!indexValue) {
      return null;
    }
    let date;
    const { query, range } = indexValue;
    if (Array.isArray(indexValue.query)) {
      date = query[0];
    } else if (range === 'min') {
      date = query;
    } else {
      return null;
    }
    return moment(date).format('DD/MM/YYYY');
  };
  const getEndValue = () => {
    const indexValue = filters[index];
    if (!indexValue) {
      return null;
    }
    let date;
    const { query, range } = indexValue;
    if (Array.isArray(indexValue.query)) {
      date = query[1];
    } else if (range === 'max') {
      date = query;
    } else {
      return null;
    }
    return moment(date).format('DD/MM/YYYY');
  };

  // const [rangeStart, setRangeStart] = useState(getStartValue());
  // const [rangeEnd, setRangeEnd] = useState(getEndValue());

  console.log(filters);
  // console.log('rangeStart: ', rangeStart);

  const updateDates = ({ startNew, endNew }) => {
    const startOld = getStartValue();
    const endOld = getEndValue();

    let dateFilters = {};
    let start;
    let end;
    if (startNew === null) {
      // we are resetting it
      start = null;
    } else {
      start = startNew
        ? moment(startNew)
            .startOf('day')
            .format(date_fmt)
        : startOld;
    }
    if (startNew === null) {
      // we are resetting it
      start = null;
    } else {
      end = endNew
        ? moment(endNew)
            .endOf('day')
            .format(date_fmt)
        : endOld;
    }
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
  };

  return (
    <React.Fragment>
      <div className="rer-sitesearch-date" id={`advanced-filter-date-${index}`}>
        <label htmlFor="date-start-label">{translations.from}</label>
        <div className="date-wrapper">
          <DayPickerInput
            id="date-start"
            formatDate={formatDate}
            parseDate={parseDate}
            value={getStartValue()}
            placeholder=""
            onDayChange={value => {
              updateDates({ startNew: value });
            }}
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
          <button type="button" onClick={() => updateDates({ startNew: null })}>
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
            value={getEndValue()}
            placeholder=""
            onDayChange={value => {
              updateDates({ endNew: value });
            }}
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
          <button type="button" onClick={() => updateDates({ endNew: null })}>
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
