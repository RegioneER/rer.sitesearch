import React, { useContext } from 'react';
import Select, { components } from 'react-select';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

// faFolder
const { faTags, faListUl } = icons;

const IndexesFilters = () => {
  const { setFilters, filters, facets, results } = useContext(SearchContext);
  const canShow = results.length > 0 && facets && facets.indexes ? true : false;
  if (!canShow) {
    return '';
  }

  const filtersData = facets.indexes.order.map((index, idx) => {
    const facet = facets.indexes.values[index];
    const facetValues = facet.values;
    const options = Object.keys(facetValues).map(key => ({
      value: key,
      label: `${key} (${facetValues[key]})`,
    }));
    return Object.keys(facetValues).length > 0 ? (
      <div className="filter-item" key={index + idx}>
        <h3>
          {index === 'Subject' && <FontAwesomeIcon icon={faTags} />}
          {index === 'Temi' && <FontAwesomeIcon icon={faListUl} />}{' '}
          {facet.label}
        </h3>
        <Select
          options={options}
          isMulti
          isClearable
          components={{
            // eslint-disable-next-line react/display-name
            MultiValueLabel: props => (
              <components.MultiValueLabel {...props} className="text-primary" />
            ),
          }}
          className="rer-sitesearch-select text-primary"
          placeholder="Cerca per categorie"
          aria-controls="sitesearch-results-list"
          value={options.filter(option =>
            filters[index]
              ? filters[index].query.includes(option.value)
              : false,
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
      </div>
    ) : null;
  });
  return <React.Fragment>{filtersData.map(item => item)}</React.Fragment>;
};

IndexesFilters.propTypes = {};

export default IndexesFilters;
