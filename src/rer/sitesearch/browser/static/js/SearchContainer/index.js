import React, { Component } from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';
import { getTranslationCatalog } from '../utils/i18n';
import apiFetch from '../utils/apiFetch';
import qs from 'query-string';
import debounce from 'lodash.debounce';

import PropTypes from 'prop-types';

const handleSearchableText = filters => {
  if ('SearchableText' in filters) {
    return { ...filters, SearchableText: `${filters.SearchableText}*` };
  }

  return filters;
};

class SearchContainer extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(window.location.search);

    this.setFilters = newFilters => {
      let filters = JSON.parse(JSON.stringify(this.state.filters));

      // always clean batching
      delete filters.b_start;

      Object.keys(newFilters).forEach(key => {
        const value = newFilters[key];
        if (value && value.length > 0) {
          filters[key] = value;
        } else if (key in filters) {
          delete filters[key];
        }
      });

      if (!this.state.loading) this.setState({ loading: true });

      const searchParams = qs.stringify(filters, {
        skipNull: true,
        skipEmptyString: true,
      });
      window.history.pushState(
        {},
        '',
        `${this.props.baseUrl}/@@search?${searchParams}`,
      );

      apiFetch({
        url: this.props.baseUrl + '/@search',
        params: handleSearchableText(filters),
        method: 'GET',
      }).then(({ data }) => {
        this.setState({
          filters,
          results: data.items,
          total: data.items_total,
          batching: data.batching,
          loading: false,
        });
      });
    };

    /**
     * TODO: parse query string for default filters
     */
    this.state = {
      results: [],
      total: 0,
      loading: true,
      query: Object.keys(query).length > 0 ? query : null,
      batching: { numpages: 0, current_page: 0, pagesize: 0 },
      translations: {},
      filters: {
        metadata_fields: ['Date', 'Subject', 'scadenza_bando', 'effective'], //temi
        // (oppure effective e modified e prendo la piu recente)
        SearchableText:
          query && query.SearchableText ? query.SearchableText : '',
        sort_on: null,
        sort_order: null,
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
      setFilters: debounce(this.setFilters, 100),
      isMobile: window.innerWidth < 1200,
    };
  }

  handleResize() {
    console.log('mobile: ', window.innerWidth < 1200);
    // this.setState({
    //   isMobile: window.innerWidth < 1200,
    // });
  }

  componentDidMount() {
    // this.handleResize();
    window.addEventListener('resize', this.handleResize);

    const endPoint = this.state.query ? '/@search' : '/@search-filters';
    const params = this.state.query ? this.state.filters : null;

    const searchParams = qs.stringify(this.state.filters, {
      skipNull: true,
      skipEmptyString: true,
    });
    window.history.pushState(
      {},
      '',
      `${this.props.baseUrl}/@@search?${searchParams}`,
    );
    const fetches = [
      apiFetch({
        url: this.props.baseUrl + endPoint,
        params: handleSearchableText(params),
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
          total: searchResults.items_total,
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

  render() {
    return (
      <div className="rer-search-container">
        <SearchContext.Provider value={this.state}>
          <div className="row" aria-live="polite">
            <div className="col col-md-3">
              <SearchFilters />
            </div>
            <div className="col col-md-9">
              {!this.state.isMobile && (
                <SpecificFilters id="search-container" />
              )}
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
