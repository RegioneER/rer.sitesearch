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
      value={value}
      onChange={options => setFilters({ state: options })}
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

const SpecificFilterDate = ({ id, label = '' }) => (
  <div id={`advanced-filter-date-${id}`}>
    <label htmlFor={id}>{label}</label>
    <DayPickerInput
      id={id}
      formatDate={formatDate}
      parseDate={parseDate}
      placeholder={`${formatDate(new Date())}`}
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
};

const SpecificFilter = ({ type, ...rest }) => {
  if (type === 'date') {
    return <SpecificFilterDate {...rest} />;
  } else if (type === 'array') {
    return <SpecificFilterArray {...rest} />;
  } else {
    return null;
  }
};

export default SpecificFilter;
