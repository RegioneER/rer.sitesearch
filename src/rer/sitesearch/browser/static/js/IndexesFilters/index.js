import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';
import SelectField from './select';
import BooleanField from './boolean';

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
    let field = '';
    switch (facet.type) {
      case 'BooleanIndex':
        field = (
          <BooleanField
            values={facetValues}
            filters={filters}
            index={index}
            setFilters={setFilters}
          />
        );
        break;
      default:
        field = (
          <SelectField
            values={facetValues}
            filters={filters}
            index={index}
            setFilters={setFilters}
          />
        );
        break;
    }
    return Object.keys(facetValues).length > 0 ? (
      <div className="filter-item" key={index + idx}>
        <h3>
          {index === 'Subject' && <FontAwesomeIcon icon={faTags} />}
          {index === 'Temi' && <FontAwesomeIcon icon={faListUl} />}{' '}
          {facet.label}
        </h3>
        {field}
      </div>
    ) : null;
  });
  return <React.Fragment>{filtersData.map(item => item)}</React.Fragment>;
};

IndexesFilters.propTypes = {};

export default IndexesFilters;
