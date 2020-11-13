import React from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';

const SearchContainer = () => (
  <div>
    <div className="row" aria-live="polite">
      <div className="col col-md-3">
        <SearchFilters />
      </div>
      <div className="col col-md-9">
        <SpecificFilters />
        <SearchResults />
      </div>
    </div>
  </div>
);

export default SearchContainer;
