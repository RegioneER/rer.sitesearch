import React from 'react';

const SearchContext = React.createContext({
  results: [],
  total: 0,
  loading: false,
  translations: {},
  filters: {},
  facets: {},
  path_infos: {},
  b_size: 20,
  baseUrl: '',
  current_site: '',
  setFilters: () => {},
  setFacets: () => {},
  doSearch: () => {},
  getTranslationFor: () => {},
});

export default SearchContext;
