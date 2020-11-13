import React from 'react';

const SearchContext = React.createContext({
  results: [],
  translations: {},
  filters: {},
  setFilters: () => {},
});

export default SearchContext;
