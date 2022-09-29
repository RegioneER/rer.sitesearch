import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';

const BooleanField = ({ values, filters, index, setFilters }) => {
  const { translations } = useContext(SearchContext);

  const options = Object.keys(values).map(key => {
    const label = `${translations[key] ? translations[key] : key} (${
      values[key]
    })`;
    return {
      value: key,
      label,
    };
  });
  return (
    <Select
      options={options}
      isClearable
      components={{
        // eslint-disable-next-line react/display-name
        MultiValueLabel: props => (
          <components.MultiValueLabel {...props} className="text-primary" />
        ),
      }}
      className="rer-sitesearch-select text-primary"
      placeholder="Seleziona un valore"
      aria-controls="sitesearch-results-list"
      value={options.filter(option => filters[index] == option.value)}
      onChange={option => {
        if (!option || option.length == 0) {
          setFilters({ [index]: '' });
        } else {
          setFilters({
            [index]: option.value,
          });
        }
      }}
    />
  );
};

BooleanField.propTypes = {
  values: PropTypes.object,
  filters: PropTypes.object,
  index: PropTypes.string,
  setFilters: PropTypes.func,
};

export default BooleanField;
