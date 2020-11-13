import React from 'react';
import Header from './Header';
import InEvidenceResults from './InEvidenceResults';
import Pagination from './Pagination';
import ResultItem from './ResultItem';

const SearchResults = () => {
  let results = [];

  //[ToDo]: da togliere
  for (let i = 0; i < 20; i++) {
    const similar = {
      id: i + 'similar',
      date: '20/01/2020',
      path: 'ambiente/parchi/.../alberi-monumentali/' + i,
      url: '/ambiente/parchi/.../alberi-monumentali/' + i,
      title: 'Titolo del risultato similare della lista numero ' + i,
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
      expire_date: '18/12/2021 10:00',
      themes: ['luoghi da scoprire', 'parchi', 'natura'],
      categories: ['cittadini', 'parchi'],
    };
    const similarResults = [
      { ...similar, id: similar.id + '-0', title: similar.title + ' - 0' },
      { ...similar, id: similar.id + '-1', title: similar.title + ' - 1' },
      { ...similar, id: similar.id + '-2', title: similar.title + ' - 2' },
      { ...similar, id: similar.id + '-3', title: similar.title + ' - 3' },
      { ...similar, id: similar.id + '-4', title: similar.title + ' - 4' },
    ];

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
      similarResults: similarResults,
    });
  }

  let inEvidenceResults = [
    {
      id: 'giovani',
      url: '/ambiente/i-giovani-alberi',
      title: 'I giovani alberi',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
    },
    {
      id: 'vecchi',
      url: '/ambiente/i-vecchi-alberi',
      title: 'I vecchi alberi',
      description:
        'Lorem ipsum dolor sit amet consectetur adipiscing elit dui vivamus suscipit sed risus, dictum porttitor laoreet sodales aenean vestibulum iaculis aliquam auctor vel sem. Sociis enim nostra egestas',
    },
  ];
  return (
    <div className="search-results">
      <h2 className="sr-only" id="search-results">
        Risultati della ricerca
      </h2>
      <a href="#search-filters" className="sr-only skip-link">
        Vai ai filtri
      </a>

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
