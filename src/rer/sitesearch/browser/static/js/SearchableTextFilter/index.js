import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

// faFolder
const { faSearch, faChevronRight } = icons;

const SearchableTextFilter = ({ toggleAdvancedFilters }) => {
  const { isMobile, setFilters, filters, translations } = useContext(
    SearchContext,
  );
  const [searchableText, setSearchableText] = useState(null);

  return (
    <div className="filter-item">
      {translations['filters_title_Cerca'] && (
        <h3>{translations['filters_title_Cerca']}</h3>
      )}
      <form className="default-search">
        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder={translations['Digita il testo da cercare...']}
            aria-label={
              translations['Digita il testo da cercare...']
                ? translations['Digita il testo da cercare...']
                : 'Digita il testo da cercare...'
            }
            aria-controls="sitesearch-results-list"
            name="SearchableText"
            value={
              searchableText !== null ? searchableText : filters.SearchableText
            }
            onChange={e => setSearchableText(e.target.value)}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              type="submit"
              onClick={e => {
                e.preventDefault();
                setFilters({
                  SearchableText:
                    searchableText !== null
                      ? searchableText
                      : filters.SearchableText,
                });
              }}
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
            onClick={e => {
              e.preventDefault();
              toggleAdvancedFilters();
            }}
            className="plone-btn plone-btn-primary"
          >
            {translations['Ricerca avanzata']
              ? translations['Ricerca avanzata']
              : 'Ricerca avanzata'}
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </form>
    </div>
  );
};

SearchableTextFilter.propTypes = {
  toggleAdvancedFilters: PropTypes.func,
};

export default SearchableTextFilter;
