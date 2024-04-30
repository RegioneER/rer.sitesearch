import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const SelectField = ({ values, filters, index, setFilters, isMulti }) => {
  const { translations } = useContext(SearchContext);
  const options = Object.keys(values).map(key => {
    const label = `${translations[key.trim()] ? translations[key.trim()] : key
      } (${values[key]})`;
    return {
      value: key,
      label,
    };
  });
  return (
    <Select
      options={options}
      isMulti={isMulti}
      isClearable
      components={{
        // eslint-disable-next-line react/display-name
        MultiValueLabel: props => (
          <components.MultiValueLabel {...props} className="text-primary" />
        ),
      }}
      className="rer-sitesearch-select text-primary"
      placeholder="Seleziona un valore"
      value={options.filter(option =>
        filters[index] ? filters[index].query.includes(option.value) : false,
      )}
      onChange={option => {
        if (!option || option.length == 0) {
          setFilters({ [index]: '' });
        } else {
          setFilters({
            [index]: {
              query: option.map(({ value }) => value),
              operator: 'and',
            },
          });
        }
      }}
    />
  );
};

SelectField.propTypes = {
  values: PropTypes.object,
  filters: PropTypes.object,
  index: PropTypes.string,
  setFilters: PropTypes.func,
  isMulti: PropTypes.bool
};

export default SelectField;
