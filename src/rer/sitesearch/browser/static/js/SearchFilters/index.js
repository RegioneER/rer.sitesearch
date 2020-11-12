import React, { useState } from 'react';
import qs from 'query-string';
import Select from 'react-select';

const SearchFilters = () => {
  const query = qs.parse(window.location.search);
  const [searchableText, setSearchableText] = useState(
    query && query.SearchableText ? query.SearchableText : '',
  );
  const [path, setPath] = useState('');
  const [types, setTypes] = useState('');
  const [categories, setCategories] = useState([]);
  const [temi, setTemi] = useState([]);

  return (
    <div className="filters-wrapper">
      <h2 className="sr-only" id="search-filters">
        Parametri di ricerca
      </h2>
      <a href="#search-results" className="sr-only skip-link">
        Vai ai risultati
      </a>

      {/* Cerca */}
      <div className="filter-item">
        <h3>Cerca</h3>
        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder="Digita il testo da cercare..."
            name="SearchableText"
            value={searchableText}
            onChange={e => setSearchableText(e.target.value)}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              type="button"
              aria-label="Cerca"
            >
              <span className="glyphicon glyphicon-search" aria-hidden="true" />
            </button>
          </span>
        </div>
      </div>

      {/* Dove */}
      <div className="filter-item">
        <h3>
          Dove <i className="fas fa-folder"></i>
        </h3>
        <div className="radio">
          <label className={path === '' ? 'selected' : ''}>
            <input
              type="radio"
              name="path"
              value=""
              checked={path === ''}
              onChange={e => setPath(e.target.value)}
            />
            In tutta la Regione Emilia-Romagna
          </label>
        </div>
        <div className="radio">
          <label className={path === '/ambiente' ? 'selected' : ''}>
            <input
              type="radio"
              name="path"
              value="/ambiente"
              checked={path === '/ambiente'}
              onChange={e => setPath(e.target.value)}
            />
            Solo in <strong>Ambiente</strong>
          </label>
        </div>
        <div className="radio">
          <label className={path === '/ambiente/parchi' ? 'selected' : ''}>
            <input
              type="radio"
              name="path"
              value="/ambiente/parchi"
              checked={path === '/ambiente/parchi'}
              onChange={e => setPath(e.target.value)}
            />
            nella sezione <strong>Parchi</strong>
          </label>
        </div>
      </div>

      {/* Cosa */}
      <div className="filter-item">
        <h3>
          Cosa <i className="far fa-question-circle"></i>
        </h3>
        <div className="radio">
          <label className={types === '' ? 'selected' : ''}>
            <input
              type="radio"
              name="types"
              value=""
              checked={types === ''}
              onChange={e => setTypes(e.target.value)}
            />
            Tutti i tipi di contenuto (70)
          </label>
        </div>
        <div className="radio">
          <label className={types === 'Documenti' ? 'selected' : ''}>
            <i className="fas fa-file"></i>
            <input
              type="radio"
              name="types"
              value="Documenti"
              checked={types === 'Documenti'}
              onChange={e => setTypes(e.target.value)}
            />
            Documenti (15)
          </label>
        </div>
        <div className="radio">
          <label className={types === 'Allegati e norme' ? 'selected' : ''}>
            <i className="fas fa-archive"></i>
            <input
              type="radio"
              name="types"
              value="Allegati e norme"
              checked={types === 'Allegati e norme'}
              onChange={e => setTypes(e.target.value)}
            />
            Allegati e norme (45)
          </label>
        </div>
        <div className="radio">
          <label className={types === 'Bandi' ? 'selected' : ''}>
            <i className="fas fa-broadcast-tower"></i>
            <input
              type="radio"
              name="types"
              value="Bandi"
              checked={types === 'Bandi'}
              onChange={e => setTypes(e.target.value)}
            />
            Bandi (2)
          </label>
        </div>
      </div>

      {/* categories */}
      <div className="filter-item">
        <h3>
          Categorie <i className="fas fa-tags"></i>
        </h3>
        <Select
          options={[
            { value: 'cittadini', label: 'Cittadini' },
            { value: 'ambient', label: 'Ambiente' },
          ]}
          isClearable
          isMulti
          placeholder="Cerca per categorie"
          defaultValue={categories}
          onChange={option => setCategories(option)}
        />
      </div>

      {/* temi */}
      <div className="filter-item">
        <h3>
          Temi <i className="fas fa-list-ul"></i>
        </h3>
        <Select
          options={[
            { value: 'cittadini', label: 'Cittadini' },
            { value: 'ambient', label: 'Ambiente' },
          ]}
          isMulti
          isClearable
          placeholder="Cerca per temi"
          defaultValue={temi}
          onChange={option => setTemi(option)}
        />
      </div>
    </div>
  );
};

export default SearchFilters;
