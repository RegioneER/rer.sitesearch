import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';
import SelectField from './select';
import BooleanField from './boolean';
import DateField from './date';

// faFolder
const { faTags, faListUl } = icons;

const IndexesFilters = () => {
  const { setFilters, filters, facets, results } = useContext(SearchContext);
  const facetsIndexes = facets ? facets.indexes : null;
  const hasDateIndex = facetsIndexes
    ? Object.values(facetsIndexes.values).filter(
      index => index.type === 'DateIndex',
    ).length > 0
    : false;
  const canShow =
    hasDateIndex || (results.length > 0 && facetsIndexes) ? true : false;
  if (!canShow) {
    return '';
  }

  const filtersData = facetsIndexes.order.map((index, idx) => {
    const facet = facetsIndexes.values[index];
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
      case 'DateIndex':
        field = (
          <DateField filters={filters} index={index} setFilters={setFilters} />
        );
        break;
      case 'Creator':
        field = (
          <SelectField
            values={facetValues}
            filters={filters}
            index={index}
            setFilters={setFilters}
            isMulti={false}
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
    return facet.type === 'DateIndex' || Object.keys(facetValues).length > 0 ? (
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
