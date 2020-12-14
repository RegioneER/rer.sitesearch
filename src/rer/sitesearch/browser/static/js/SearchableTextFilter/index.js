import React, { useState, useContext } from 'react';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

// faFolder
const { faSearch, faChevronRight } = icons;

const SearchableTextFilter = () => {
  const { isMobile, setFilters, filters, translations } = useContext(
    SearchContext,
  );
  const [searchableText, setSearchableText] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(
    isMobile ? false : true,
  );

  return (
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
              searchableText !== null ? searchableText : filters.SearchableText
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
  );
};

SearchableTextFilter.propTypes = {};

export default SearchableTextFilter;