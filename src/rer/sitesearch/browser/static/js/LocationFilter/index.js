import React, { useContext } from 'react';
import SearchContext from '../utils/searchContext';

const PathFilters = () => {
  const { setFilters, filters, path_infos } = useContext(SearchContext);
  let { path } = filters;
  if (path && typeof path !== 'string') {
    path = path.query;
  }
  if (!path || path.length === 0 || !path_infos) {
    return '';
  }
  const { root, path_title } = path_infos;
  return (
    <React.Fragment>
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
          Nella sezione <strong>{path_title}</strong>
        </label>
      </div>
    </React.Fragment>
  );
};

const SitesFilters = () => {
  const {
    setFilters,
    filters,
    facets,
    current_site,
    translations,
  } = useContext(SearchContext);
  const { path, site_name } = filters;
  if (!facets.sites) {
    return '';
  }
  const totalResultsFacets = facets.sites
    ? Object.values(facets.sites.values).reduce((acc, site) => acc + site, 0)
    : 0;
  const currentResultsFacets = facets.sites
    ? facets.sites.values[current_site]
    : 0;
  const allLabel = translations.sites_all_label
    ? translations.sites_all_label
    : 'In all available sites';

  const currentSiteLabel = translations.sites_local_label
    ? translations.sites_local_label
    : 'In this site';
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
          {allLabel} ({totalResultsFacets})
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
            checked={path ? false : site_name === current_site || !site_name}
            onChange={e => setFilters({ site_name: e.target.value, path: '' })}
          />
          {currentSiteLabel} ({currentResultsFacets || 0})
        </label>
      </div>
    </React.Fragment>
  );
};

const LocationFilter = () => {
  const { translations, filters, path_infos, facets } = useContext(
    SearchContext,
  );
  let hasPath = true;
  let hasSites = facets.sites ? true : false;
  let { path } = filters;
  if (path && typeof path !== 'string') {
    path = path.query;
  }
  if (!path || path.length === 0 || !path_infos) {
    hasPath = false;
  }
  if (!hasPath && !hasSites) {
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
