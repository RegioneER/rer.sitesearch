import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SearchContext from '../utils/searchContext';
import SpecificFilter from './SpecificFilter';

const SpecificFilters = ({ id }) => {
  const { setFilters, filters, facets, translations } = useContext(
    SearchContext,
  );
  const advancedFilters = facets.groups.values[filters.group].advanced_filters;

  return (
    <div className="specific-filters" key={id}>
      <div className="title">
        {translations['Filtra i bandi per finanziamenti ed opportunità']}
      </div>
      <div className="row-specific-filters">
        {Object.keys(advancedFilters).map(advFilter => (
          <div className="col-specific-filters" key={advFilter}>
            <SpecificFilter
              type={advFilter.type}
              id={advFilter}
              {...advancedFilters[advFilter]}
              placeholder={translations[advFilter]}
              value={filters[advFilter]}
              setFilters={setFilters}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

SpecificFilters.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SpecificFilters;
