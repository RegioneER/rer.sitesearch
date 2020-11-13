import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';

const SearchFilters = () => {
  const { isMobile } = useContext(SearchContext);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(
    isMobile ? false : true,
  );

  useEffect(() => {
    console.log('useEffect', isMobile);
    setShowAdvancedSearch(isMobile ? false : true);
  }, [isMobile]);

  return (
    <SearchContext.Consumer>
      {({ setFilters, filters, isMobile }) => (
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
            <div className="default-search">
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Digita il testo da cercare..."
                  name="searchableText"
                  value={filters.searchableText}
                  onChange={e => setFilters({ searchableText: e.target.value })}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-default"
                    type="button"
                    aria-label="Cerca"
                  >
                    <i className="fas fa-search" />
                  </button>
                </span>
              </div>
              {isMobile && (
                <button
                  onClick={() => {
                    setShowAdvancedSearch(!showAdvancedSearch);
                  }}
                  className="plone-btn plone-btn-primary"
                >
                  Ricerca avanzata <i className="fas fa-chevron-right" />
                </button>
              )}
            </div>
          </div>

          <div
            className={`advanced-search ${showAdvancedSearch ? '' : 'hide'}`}
          >
            {isMobile && (
              <>
                <div className="close-advanced-search">
                  <button
                    onClick={() => {
                      setShowAdvancedSearch(false);
                    }}
                    className="plone-btn plone-btn-link"
                    title="Chiudi la ricerca avanzata"
                  >
                    <i className="fas fa-times" />
                  </button>
                </div>

                <h3>Ricerca avanzata</h3>
              </>
            )}

            {/* Dove */}
            <div className="filter-item">
              <h3>
                Dove <i className="fas fa-folder"></i>
              </h3>
              <label className={filters.path === '' ? 'selected' : ''}>
                <input
                  type="radio"
                  name="path"
                  value=""
                  checked={filters.path === ''}
                  onChange={e => setFilters({ path: e.target.value })}
                />
                In tutta la Regione Emilia-Romagna
              </label>
              <div className="radio">
                <label
                  className={filters.path === '/ambiente' ? 'selected' : ''}
                >
                  <input
                    type="radio"
                    name="path"
                    value="/ambiente"
                    checked={filters.path === '/ambiente'}
                    onChange={e => setFilters({ path: e.target.value })}
                  />
                  Solo in <strong>Ambiente</strong>
                </label>
              </div>
              <div className="radio">
                <label
                  className={
                    filters.path === '/ambiente/parchi' ? 'selected' : ''
                  }
                >
                  <input
                    type="radio"
                    name="path"
                    value="/ambiente/parchi"
                    checked={filters.path === '/ambiente/parchi'}
                    onChange={e => setFilters({ path: e.target.value })}
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
                <label className={filters.types === '' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="types"
                    value=""
                    checked={filters.types === ''}
                    onChange={e => setFilters({ types: e.target.value })}
                  />
                  Tutti i tipi di contenuto (70)
                </label>
              </div>
              <div className="radio">
                <label
                  className={filters.types === 'Documenti' ? 'selected' : ''}
                >
                  <input
                    type="radio"
                    name="types"
                    value="Documenti"
                    checked={filters.types === 'Documenti'}
                    onChange={e => setFilters({ types: e.target.value })}
                  />
                  <i className="fas fa-file"></i>
                  Documenti (15)
                </label>
              </div>
              <div className="radio">
                <label
                  className={
                    filters.types === 'Allegati e norme' ? 'selected' : ''
                  }
                >
                  <input
                    type="radio"
                    name="types"
                    value="Allegati e norme"
                    checked={filters.types === 'Allegati e norme'}
                    onChange={e => setFilters({ types: e.target.value })}
                  />
                  <i className="fas fa-archive"></i>
                  Allegati e norme (45)
                </label>
              </div>
              <div className="radio">
                <label className={filters.types === 'Bandi' ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="types"
                    value="Bandi"
                    checked={filters.types === 'Bandi'}
                    onChange={e => setFilters({ types: e.target.value })}
                  />
                  <i className="fas fa-broadcast-tower"></i>
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
                defaultValue={filters.categories}
                onChange={option => setFilters({ categories: option })}
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
                defaultValue={filters.temi}
                onChange={option => setFilters({ temi: option })}
              />
            </div>

            {isMobile && <SpecificFilters />}
            {isMobile && (
              <div className="submit-wrapper">
                <button
                  className="plone-btn plone-btn-primary"
                  title="Filtra i risultati"
                >
                  Filtra i risultati
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </SearchContext.Consumer>
  );
};

SearchFilters.propTypes = {
  isMobile: PropTypes.bool,
};

export default SearchFilters;
