import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';

const PathFilters = () => {
  const { setFilters, filters, path_infos, facets } = useContext(SearchContext);
  const { path } = filters;
  if (!path || path.length === 0 || !path_infos) {
    return '';
  }
  const { root, site_name, path_title } = path_infos;
  return (
    <React.Fragment>
      {!facets.sites ||
        (facets.sites.order.length === 0 && (
          <div className="radio">
            <label className={path === root ? 'selected' : ''}>
              <input
                type="radio"
                name="path"
                value={root}
                checked={path === root}
                onChange={() => setFilters({ path: '' })}
                aria-controls="sitesearch-results-list"
              />
              In tutto <strong>{site_name}</strong>
            </label>
          </div>
        ))}
      <div className="radio">
        <label className={path !== root ? 'selected' : ''}>
          <input
            type="radio"
            name="path"
            value={path}
            checked={true}
            onChange={e => setFilters({ path: e.target.value })}
            aria-controls="sitesearch-results-list"
          />
          nella sezione <strong>{path_title}</strong>
        </label>
      </div>
    </React.Fragment>
  );
};

const SitesFilters = () => {
  const { setFilters, filters, facets, current_site } = useContext(
    SearchContext,
  );
  if (!facets || !facets.sites || facets.sites.order.length === 0) {
    return '';
  }
  const { path, site_name } = filters;
  const totalResultsFacets = Object.values(facets.sites.values).reduce(
    (acc, site) => acc + site,
    0,
  );
  return (
    <React.Fragment>
      <div className="radio">
        <label
          className={filters.site_name === 'all' ? 'selected text-primary' : ''}
        >
          <input
            type="radio"
            name="site_name"
            value="all"
            checked={!path && filters.site_name == 'all'}
            onChange={e => setFilters({ site_name: e.target.value, path: '' })}
          />
          Regione Emilia-Romagna ({totalResultsFacets})
        </label>
      </div>
      <div className="radio">
        <label
          className={
            site_name === current_site || !site_name
              ? 'selected text-primary'
              : ''
          }
        >
          <input
            type="radio"
            name="site_name"
            value={current_site}
            checked={site_name === current_site || !site_name}
            onChange={e => setFilters({ site_name: e.target.value, path: '' })}
          />
          {current_site} ({facets.sites.values[current_site] || 0})
        </label>
      </div>
    </React.Fragment>
  );
};

const LocationFilter = () => {
  const { filters, translations, path_infos, facets } = useContext(
    SearchContext,
  );
  const { path } = filters;
  let canShow = false;
  if (path && path.length > 0 && path_infos) {
    canShow = true;
  } else if (facets.sites && facets.sites.order.length > 0) {
    canShow = true;
  }
  if (!canShow) {
    return '';
  }

  return (
    <div className="filter-item">
      <h3>
        <i className="far fa-folder"></i>{' '}
        {translations['Dove'] ? translations['Dove'] : 'Dove'}
      </h3>
      <PathFilters></PathFilters>
      <SitesFilters></SitesFilters>
    </div>
  );
};

LocationFilter.propTypes = {};

export default LocationFilter;
