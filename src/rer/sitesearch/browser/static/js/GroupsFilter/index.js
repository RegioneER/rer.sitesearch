import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIcon } from '../utils/icons';

const GroupsFilter = () => {
  const { setFilters, filters, facets, translations, total } = useContext(
    SearchContext,
  );

  return (
    <div className="filter-item">
      <h3>
        {translations['Cosa'] ? translations['Cosa'] : 'Cosa'}{' '}
        <i className="far fa-question-circle"></i>
      </h3>
      <div className="radio">
        <label className={!filters.group ? 'selected' : ''}>
          <input
            type="radio"
            name="group"
            value=""
            checked={!filters.group}
            onChange={() => setFilters({ group: null })}
          />
          {translations['any_group']
            ? translations['any_group']
            : 'Tutti i tipi di contenuto'}
          {` (${total})`}
        </label>
      </div>
      {facets &&
        facets.groups &&
        facets.groups.order.map((group, idx) => (
          <div className="radio" key={group + idx}>
            <label className={filters.group === group ? 'selected' : ''}>
              <input
                type="radio"
                name="types"
                value={group}
                checked={filters.group === group}
                onChange={() => setFilters({ group })}
              />
              <FontAwesomeIcon
                icon={getIcon(facets.groups.values[group].icon)}
              />
              {`${group} (${facets.groups.values[group].count})`}
            </label>
          </div>
        ))}
    </div>
  );
};

GroupsFilter.propTypes = {};

export default GroupsFilter;
