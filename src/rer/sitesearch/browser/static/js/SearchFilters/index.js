import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons, getIcon } from '../utils/icons';
import apiFetch from '../utils/apiFetch';

const { faSearch, faChevronRight, faTimes, faFolder, faTags, faListUl } = icons;

const SearchFilters = ({ baseUrl }) => {
  const {
    isMobile,
    setFilters,
    setFacets,
    filters,
    facets,
    translations,
  } = useContext(SearchContext);
  const [searchableText, setSearchableText] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(
    isMobile ? false : true,
  );

  useEffect(() => {
    setShowAdvancedSearch(isMobile ? false : true);
  }, [isMobile]);

  useEffect(() => {
    if (!facets) {
      apiFetch({
        url: baseUrl + '/@search-filters',
        params: {},
        method: 'GET',
      }).then(data => setFacets(data.data));
    }
  }, []);

  return (
    <div className="filters-wrapper">
      <h2 className="sr-only" id="search-filters">
        {translations['Parametri di ricerca']
          ? translations['Parametri di ricerca']
          : 'Parametri di ricerca'}
      </h2>
      <a href="#search-results" className="sr-only skip-link">
        {translations['Vai ai risultati']
          ? translations['Vai ai risultati']
          : 'Vai ai risultati'}
      </a>

      {/* Cerca */}
      <div className="filter-item">
        <h3>{translations['filters_title_Cerca']}</h3>
        <div className="default-search">
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              placeholder={translations['Digita il testo da cercare...']}
              name="SearchableText"
              value={
                searchableText !== null
                  ? searchableText
                  : filters.SearchableText
              }
              onChange={e => setSearchableText(e.target.value)}
            />
            <span className="input-group-btn">
              <button
                className="btn btn-default"
                type="button"
                onClick={() =>
                  setFilters({
                    SearchableText:
                      searchableText !== null
                        ? searchableText
                        : filters.SearchableText,
                  })
                }
                aria-label={
                  translations['button_Cerca']
                    ? translations['button_Cerca']
                    : 'Cerca'
                }
              >
                <FontAwesomeIcon icon={faSearch} />
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
              {translations['Ricerca avanzata']
                ? translations['Ricerca avanzata']
                : 'Ricerca avanzata'}
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
      </div>

      <div
        className={`advanced-search ${showAdvancedSearch ? 'open' : 'close'}`}
      >
        {isMobile && (
          <>
            <div className="close-advanced-search">
              <button
                onClick={() => {
                  setShowAdvancedSearch(false);
                }}
                className="plone-btn plone-btn-link"
                title={
                  translations['Chiudi la ricerca avanzata']
                    ? translations['Chiudi la ricerca avanzata']
                    : 'Chiudi la ricerca avanzata'
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <h3>
              {translations['Ricerca avanzata']
                ? translations['Ricerca avanzata']
                : 'Ricerca avanzata'}
            </h3>
          </>
        )}

        {/* Dove */}
        <div className="filter-item">
          <h3>
            Dove <FontAwesomeIcon icon={faFolder} />
          </h3>
          <div className="radio">
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
          </div>
          <div className="radio">
            <label className={filters.path === '/ambiente' ? 'selected' : ''}>
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
              className={filters.path === '/ambiente/parchi' ? 'selected' : ''}
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
            {translations['Cosa'] ? translations['Cosa'] : 'Cosa'}{' '}
            <i className="far fa-question-circle"></i>
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
          {facets &&
            facets.groups &&
            facets.groups.order.map((group, idx) => (
              <div className="radio" key={group + idx}>
                <label className={filters.type === group ? 'selected' : ''}>
                  <input
                    type="radio"
                    name="types"
                    value={group}
                    checked={filters.types === group}
                    onChange={() => setFilters({ types: group })}
                  />
                  <FontAwesomeIcon
                    icon={getIcon(facets.groups.values[group].icon)}
                  />
                  {`${group} (${facets.groups.values[group].count})`}
                </label>
              </div>
            ))}
        </div>

        {/* categories */}
        <div className="filter-item">
          <h3>
            Categorie <FontAwesomeIcon icon={faTags} />
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
            Temi <FontAwesomeIcon icon={faListUl} />
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

        {isMobile && <SpecificFilters id="search-filters" />}
        {isMobile && (
          <div className="submit-wrapper">
            <button
              className="plone-btn plone-btn-primary"
              onClick={() => {
                setShowAdvancedSearch(false);
              }}
            >
              {translations['Filtra i risultati']
                ? translations['Filtra i risultati']
                : 'Filtra i risultati'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

SearchFilters.propTypes = {
  isMobile: PropTypes.bool,
  baseUrl: PropTypes.string,
};

export default SearchFilters;
