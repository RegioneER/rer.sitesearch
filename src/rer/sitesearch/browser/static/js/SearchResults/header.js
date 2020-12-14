import React from 'react';
import Select from 'react-select';
import SearchContext from '../utils/searchContext';

const searchOrderMapping = {
  relevance: {
    sort_on: null,
    sort_order: null,
  },
  effective: {
    sort_on: 'effective',
    sort_order: 'reverse',
  },
  sortable_title: {
    sort_on: 'sortable_title',
    sort_order: 'ascending',
  },
};

const Header = ({ searchHasFilters = false }) => (
  <SearchContext.Consumer key="search-results-header">
    {({ translations, facets, filters, setFilters, total }) => {
      const allTotal = facets.groups.values
        ? facets.groups.values['All content types'].count
        : 0;
      const group = filters.group;
      const groupCount = group ? facets.groups.values[group].count : total;
      return (
        <div className="results-header">
          <div className="total-items">
            <span>
              <strong>{groupCount}</strong>{' '}
              <span className="desktop-only">
                {translations['elementi su']}{' '}
              </span>
              <span className="mobile-only">/ </span> {allTotal}{' '}
              <span className="desktop-only">{translations['filtrati']}</span>
            </span>{' '}
            {searchHasFilters && (
              <a
                href="#"
                className="reset-filters"
                onClick={e => {
                  e.preventDefault();
                  setFilters(null);
                }}
              >
                ({translations['Annulla filtri']})
              </a>
            )}
          </div>
          <div className="order-by">
            <div className="select-label desktop-only">
              {translations['Ordina per']}{' '}
            </div>
            <div className="select">
              <Select
                options={Object.keys(searchOrderMapping).map(value => ({
                  value,
                  label: translations[value],
                }))}
                isClearable={false}
                placeholder={translations['Ordina per']}
                value={{
                  value: filters.sort_on ? filters.sort_on : 'relevance',
                  label:
                    translations[
                      filters.sort_on ? filters.sort_on : 'relevance'
                    ],
                }}
                onChange={option =>
                  setFilters(searchOrderMapping[option.value])
                }
              />
            </div>
          </div>
        </div>
      );
    }}
  </SearchContext.Consumer>
);

export default Header;
