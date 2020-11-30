import React from 'react';
import SearchContext from '../utils/searchContext';
import Header from './Header';
import InEvidenceResults from './InEvidenceResults';
import Pagination from './Pagination';
import ResultItem from './ResultItem/ResultItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

const { faCircleNotch } = icons;

const SearchResults = () => {
  let inEvidenceResults = [
    {
      '@id': '/ambiente/i-giovani-alberi',
      title: 'I giovani alberi',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
    },
    {
      '@id': '/ambiente/i-vecchi-alberi',
      title: 'I vecchi alberi',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
    },
  ];
  return (
    <SearchContext.Consumer key="search-results">
      {({ translations, loading, results }) => {
        console.log(results);
        return (
          <div className="search-results">
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
                <InEvidenceResults results={inEvidenceResults} />

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
              <p>
                {translations['no_results_label']
                  ? translations['no_results_label']
                  : 'Nessun risultato soddisfa la tua ricerca'}
              </p>
            )}
          </div>
        );
      }}
    </SearchContext.Consumer>
  );
};

export default SearchResults;
