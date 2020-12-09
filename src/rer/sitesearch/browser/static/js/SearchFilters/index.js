import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import SpecificFilters from '../SpecificFilters';
import GroupsFilter from '../GroupsFilter';
import IndexesFilters from '../IndexesFilters';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

// faFolder
const { faSearch, faChevronRight, faTimes } = icons;

const SearchFilters = () => {
  const { isMobile, setFilters, filters, facets, translations } = useContext(
    SearchContext,
  );
  const [searchableText, setSearchableText] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(
    isMobile ? false : true,
  );

  useEffect(() => {
    setShowAdvancedSearch(isMobile ? false : true);
  }, [isMobile]);

  const showMobileFilters =
    isMobile &&
    filters &&
    filters.group &&
    facets &&
    facets.groups &&
    facets.groups.values[filters.group].advanced_filters;

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
        {/*
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
        */}

        <GroupsFilter></GroupsFilter>
        <IndexesFilters></IndexesFilters>

        {showMobileFilters && <SpecificFilters id="search-filters" />}
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
