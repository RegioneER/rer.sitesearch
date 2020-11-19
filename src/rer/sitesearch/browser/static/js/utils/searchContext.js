import React from 'react';

const SearchContext = React.createContext({
  results: [],
  loading: false,
  translations: {},
  filters: {},
  setFilters: () => {},
});

export default SearchContext;
