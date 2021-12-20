import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import SpecificFilters from '../SpecificFilters';
import GroupsFilter from '../GroupsFilter';
import LocationFilter from '../LocationFilter';
import IndexesFilters from '../IndexesFilters';
import SearchableTextFilter from '../SearchableTextFilter';
import SearchContext from '../utils/searchContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../utils/icons';

// faFolder
const { faTimes } = icons;

const SearchFilters = () => {
  const { isMobile, filters, facets, translations } = useContext(SearchContext);
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
    <aside className="filters-wrapper" role="aside">
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
      <SearchableTextFilter
        toggleAdvancedFilters={() => setShowAdvancedSearch(!showAdvancedSearch)}
      ></SearchableTextFilter>
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

        <LocationFilter></LocationFilter>
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
    </aside>
  );
};

SearchFilters.propTypes = {
  isMobile: PropTypes.bool,
  baseUrl: PropTypes.string,
};

export default SearchFilters;
