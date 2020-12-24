import React from 'react';
import SearchContext from '../utils/searchContext';
import Header from './Header';
import Pagination from './Pagination';
import ResultItem from './ResultItem/ResultItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

const { faCircleNotch } = icons;

const SearchResults = () => {
  return (
    <SearchContext.Consumer key="search-results">
      {({ translations, loading, results }) => {
        return (
          <main className="search-results">
            <h2 className="sr-only" id="search-results">
              {translations['Risultati della ricerca']}
            </h2>
            <a href="#search-filters" className="sr-only skip-link">
              {translations['Vai ai filtri']}
            </a>

            {loading ? (
              <div className="loading-wrapper">
                <FontAwesomeIcon icon={faCircleNotch} spin />
                <p>
                  {translations['loading']
                    ? translations['loading']
                    : 'Loading...'}
                </p>
              </div>
            ) : results && results.length > 0 ? (
              <>
                <Header searchHasFilters={true} />
                <div className="results-list">
                  {results.map(item => (
                    <div key={item['@id']}>
                      <ResultItem item={item} />
                    </div>
                  ))}
                </div>
                <Pagination />
              </>
            ) : (
              <p className="no-results-label">
                {translations['no_results_label']
                  ? translations['no_results_label']
                  : 'Nessun risultato soddisfa la tua ricerca'}
              </p>
            )}
          </main>
        );
      }}
    </SearchContext.Consumer>
  );
};

export default SearchResults;
