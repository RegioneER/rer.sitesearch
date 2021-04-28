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

const Header = () => (
  <SearchContext.Consumer key="search-results-header">
    {({ getTranslationFor, facets, filters, setFilters, total }) => {
      const allTotal = facets.groups.values
        ? facets.groups.values[getTranslationFor('all_types_label')].count
        : 0;
      const group = filters.group;
      const groupCount = group ? facets.groups.values[group].count : total;
      return (
        <div className="results-header">
          {Object.keys(filters).length > 0 && (
            <div className="total-items">
              {groupCount < allTotal ? (
                <>
                  <span>
                    <strong>{groupCount}</strong>{' '}
                    <span className="desktop-only">
                      {getTranslationFor('items on')}{' '}
                    </span>
                    <span className="mobile-only">/ </span> {allTotal}{' '}
                    <span className="desktop-only">
                      {getTranslationFor('filtered')}
                    </span>
                  </span>{' '}
                </>
              ) : (
                <span>
                  <strong>{allTotal}</strong> {getTranslationFor('items')}{' '}
                </span>
              )}
              {!(
                Object.keys(filters).length === 1 &&
                Object.keys(filters)[0] === 'SearchableText'
              ) && (
                <a
                  href="#"
                  className="reset-filters"
                  onClick={e => {
                    e.preventDefault();
                    setFilters(null);
                  }}
                >
                  ({getTranslationFor('Reset Filters')})
                </a>
              )}
            </div>
          )}
          <div className="order-by">
            <div className="select-label desktop-only">
              {getTranslationFor('Sort on')}{' '}
            </div>
            <div className="select">
              <Select
                options={Object.keys(searchOrderMapping).map(value => ({
                  value,
                  label: getTranslationFor(value),
                }))}
                isClearable={false}
                isSearchable={false}
                placeholder={getTranslationFor('Sort on')}
                value={{
                  value: filters.sort_on ? filters.sort_on : 'relevance',
                  label: getTranslationFor(
                    filters.sort_on ? filters.sort_on : 'Relevance',
                  ),
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
