import React from 'react';

const SearchContext = React.createContext({
  results: [],
  total: 0,
  loading: false,
  translations: {},
  filters: {},
  setFilters: () => {},
  facets: {},
  setFacets: () => {},
});

export default SearchContext;
