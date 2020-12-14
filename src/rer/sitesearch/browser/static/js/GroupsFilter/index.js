import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getIcon } from '../utils/icons';

const GroupsFilter = () => {
  const { setFilters, filters, facets, translations } = useContext(
    SearchContext,
  );
  if (!facets || !facets.groups) {
    return '';
  }
  return (
    <div className="filter-item">
      <h3>
        {translations['Cosa'] ? translations['Cosa'] : 'Cosa'}{' '}
        <i className="far fa-question-circle"></i>
      </h3>
      {facets &&
        facets.groups &&
        facets.groups.order.map((group, idx) => {
          const groupData = facets.groups.values[group];
          let selected = false;
          if (!filters.group && idx === 0) {
            selected = true;
          } else {
            if (filters.group === group) {
              selected = true;
            }
          }
          return (
            <div className="radio" key={group + idx}>
              <label className={selected ? 'selected' : ''}>
                <input
                  type="radio"
                  name="types"
                  value={group}
                  checked={selected}
                  onChange={() => setFilters({ group })}
                />
                {groupData.icon && (
                  <FontAwesomeIcon icon={getIcon(groupData.icon)} />
                )}
                {`${group} (${groupData.count})`}
              </label>
            </div>
          );
        })}
    </div>
  );
};

GroupsFilter.propTypes = {};

export default GroupsFilter;
