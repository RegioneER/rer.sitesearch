import React from 'react';

const SearchContext = React.createContext({
  results: [],
  loading: false,
  translations: {},
  filters: {},
  setFilters: () => {},
  facets: {},
  setFacets: () => {},
});

export default SearchContext;
