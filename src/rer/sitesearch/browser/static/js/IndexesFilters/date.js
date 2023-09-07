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
const currentYear = new Date().getFullYear();
const fromMonth = new Date(currentYear, 0);
const toMonth = new Date(currentYear + 10, 11);

function YearMonthForm({ date, localeUtils, onChange }) {
  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(e) {
    const { year, month } = e.target.form;
    onChange(new Date(year.value, month.value));
  };

  return (
    <form className="DayPicker-Caption">
      <select name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </form>
  );
}

YearMonthForm.propTypes = {
  date: PropTypes.object,
  localeUtils: PropTypes.object,
  onChange: PropTypes.func,
};

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
    return moment(date);
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
    return moment(date);
  };

  const updateDates = ({ startNew, endNew }) => {
    const startOld = getStartValue() ? getStartValue().format(date_fmt) : null;
    const endOld = getEndValue() ? getEndValue().format(date_fmt) : null;
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
    if (endNew === null) {
      // we are resetting it
      end = null;
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

  const start = getStartValue();
  const end = getEndValue();
  return (
    <React.Fragment>
      <div className="rer-sitesearch-date" id={`advanced-filter-date-${index}`}>
        <label htmlFor="date-start-label">{translations.from}</label>
        <div className="date-wrapper">
          <DayPickerInput
            id="date-start"
            formatDate={formatDate}
            parseDate={parseDate}
            value={start ? start.format('DD/MM/YYYY') : null}
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
            captionElement={({ date, localeUtils }) => (
              <YearMonthForm
                date={date}
                localeUtils={localeUtils}
                onChange={this.handleYearMonthChange}
              />
            )}
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
            value={end ? end.format('DD/MM/YYYY') : null}
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
