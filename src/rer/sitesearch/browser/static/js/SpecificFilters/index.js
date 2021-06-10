import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import SearchContext from '../utils/searchContext';
import SpecificFilter from './SpecificFilter';
// import moment from 'moment';

const SpecificFilters = ({ id }) => {
  const { setFilters, filters, facets, translations } = useContext(
    SearchContext,
  );
  let advancedFilters = {
    ...facets.groups.values[filters.group].advanced_filters,
  };
  const isEventRangeDates =
    advancedFilters.start &&
    advancedFilters.start.type === 'date' &&
    advancedFilters.end &&
    advancedFilters.end.type === 'date';

  if (isEventRangeDates) {
    advancedFilters = Object.keys(advancedFilters).reduce((acc, val) => {
      if (val === 'start' || val === 'end') {
        return {
          ...acc,
          date: {
            ...(acc.date ? acc.date : {}),
            [val]: advancedFilters[val],
            type: 'date_range',
          },
        };
      }

      return {
        ...acc,
        [val]: advancedFilters[val],
      };
    }, {});
  }

  const getTranslationFor = key => {
    if (translations[key]) return translations[key];
    return key;
  };

  return (
    <section
      className="specific-filters"
      key={id}
      aria-labelledby="specific-filters-title"
    >
      <div className="title" id="specific-filters-title">
        {getTranslationFor(
          'Filtra i contenuti con filtri specifici per questo gruppo',
        )}
      </div>
      <div className="row-specific-filters">
        {Object.keys(advancedFilters).map(advFilter => (
          <div className="col-specific-filters" key={advFilter}>
            <SpecificFilter
              type={advancedFilters[advFilter].type}
              id={advFilter}
              {...advancedFilters[advFilter]}
              placeholder={translations[advFilter]}
              value={filters[advFilter]}
              setFilters={setFilters}
              filters={filters}
              translations={translations}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

SpecificFilters.propTypes = {
  id: PropTypes.string.isRequired,
};

export default SpecificFilters;
