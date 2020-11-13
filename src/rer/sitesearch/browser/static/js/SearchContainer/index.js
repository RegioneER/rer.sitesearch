import React from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';
import useWindowDimensions from '../utils';

const SearchContainer = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 1200;

  return (
    <div>
      <div className="row" aria-live="polite">
        <div className="col col-md-3">
          <SearchFilters isMobile={isMobile} />
        </div>
        <div className="col col-md-9">
          {!isMobile && <SpecificFilters />}
          <SearchResults />
        </div>
      </div>
    </div>
  );
};

export default SearchContainer;
