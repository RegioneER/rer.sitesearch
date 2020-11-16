import React, { Component } from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';
import { getTranslationCatalog } from '../utils/i18n';
import apiFetch from '../utils/apiFetch';
import qs from 'query-string';

import PropTypes from 'prop-types';

class SearchContainer extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(window.location.search);

    /**
     * TODO: parse query string for default filters
     */
    this.state = {
      results: [],
      query: Object.keys(query).length > 0 ? query : null,
      batching: { numpages: 0, current_page: 0, pagesize: 0 },
      translations: {},
      filters: {
        metadata_fields: ['Date', 'Subject', 'scadenza_bando', 'effective'], //temi
        // (oppure effective e modified e prendo la piu recente)
        searchableText:
          query && query.SearchableText ? query.SearchableText : '',
        path: '',
        types: '',
        categories: '',
        temi: '',
        state: null, //Ricerca specifica - Bandi: stato dei bandi
        bando_type: null, //Ricerca specifica - Bandi: tipo di bando
        beneficiari: null, //Ricerca specifica - Bandi: beneficari
        fondo: null, //Ricerca specifica - Bandi: fondo
        materia: null, //Ricerca specifica - Bandi: materia
      },
      setFilters: this.setFilters,
      isMobile: false,
    };

    this.setFilters = this.setFilters.bind(this);
  }

  handleResize() {
    this.setState({
      isMobile: window.innerWidth < 1200,
    });
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    const endPoint = this.state.query ? '/@search' : '/@search-filters';
    const params = this.state.query ? this.state.filters : null;

    const fetches = [
      apiFetch({
        url: this.props.baseUrl + endPoint,
        params: params,
        method: 'GET',
      }),
      getTranslationCatalog(),
    ];

    Promise.all(fetches).then(data => {
      let newState = { ...this.state };
      if (data[0]) {
        const searchResults = data[0].data;

        newState = {
          ...newState,

          results: searchResults.items,
          batching: searchResults.batching,
        };
      }
      if (data[1]) {
        newState = { ...newState, translations: data[1] };
      }

      this.setState(newState);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  setFilters(newFilters) {
    let { filters } = this.state;

    // always clean batching
    delete filters.b_start;

    Object.keys(newFilters).forEach(key => {
      const value = newFilters[key];
      if (value || value.length > 0) {
        filters[key] = value;
      } else {
        if (filters.hasOwnProperty(key)) {
          delete filters[key];
        }
      }
    });

    apiFetch({
      url: this.props.baseUrl + '/@search',
      params: filters,
      method: 'GET',
    }).then(({ data }) => {
      this.setState({
        ...this.state,
        filters,
        results: data.items,
        batching: data.batching,
      });
    });
  }

  render() {
    return (
      <div className="rer-search-container">
        <SearchContext.Provider value={this.state}>
          <div className="row" aria-live="polite">
            <div className="col col-md-3">
              <SearchFilters />
            </div>
            <div className="col col-md-9">
              {!this.state.isMobile && <SpecificFilters />}
              <SearchResults />
            </div>
          </div>
        </SearchContext.Provider>
      </div>
    );
  }
}

SearchContainer.propTypes = {
  baseUrl: PropTypes.string,
};

export default SearchContainer;
