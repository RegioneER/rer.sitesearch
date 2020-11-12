import React from 'react';
import Header from './Header';
import InEvidenceResults from './InEvidenceResults';
import Pagination from './Pagination';
import ResultItem from './ResultItem';

const SearchResults = () => {
  let results = [];

  for (let i = 0; i < 20; i++) {
    results.push({
      id: i,
      date: '20/01/2020',
      path: 'ambiente/parchi/.../alberi-monumentali/' + i,
      url: '/ambiente/parchi/.../alberi-monumentali/' + i,
      title: 'Titolo del risultato della lista numero ' + i,
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
      expire_date: '18/12/2021 10:00',
      themes: ['luoghi da scoprire', 'parchi', 'natura'],
      categories: ['cittadini', 'parchi'],
    });
  }

  let inEvidenceResults = [
    {
      url: '/ambiente/i-giovani-alberi',
      title: 'I giovani alberi',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
    },
  ];
  return (
    <div className="search-results">
      <Header searchHasFilters={true} />
      <InEvidenceResults results={inEvidenceResults} />

      <div className="results-list">
        {results.map(item => (
          <div key={item.id}>
            <ResultItem item={item} />
          </div>
        ))}
      </div>
      <Pagination />
    </div>
  );
};

export default SearchResults;
