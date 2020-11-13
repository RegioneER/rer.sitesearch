import React, { Component } from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';
import { getTranslationCatalog } from '../utils/i18n';
import apiFetch from '../utils/apiFetch';
import qs from 'query-string';

class SearchContainer extends Component {
  constructor(props) {
    super(props);

    const query = qs.parse(window.location.search);

    /**
     * TODO: parse query string for default filters
     */
    this.state = {
      results: [],
      batching: { numpages: 0, current_page: 0, pagesize: 0 },
      translations: {},
      filters: {
        fullobjects: true,
        searchableText:
          query && query.SearchableText ? query.SearchableText : '',
        path: '',
        types: '',
        categories: '',
        temi: '',
      },
      setFilters: this.setFilters,
      isMobile: false,
    };

    this.setFilters = this.setFilters.bind(this);
    this.getPortalTypeFromQuery = this.getPortalTypeFromQuery.bind(this);
  }

  handleResize() {
    this.setState({
      isMobile: window.innerWidth < 1200,
    });
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
    const fetches = [
      apiFetch({
        url: '/@@search',
        params: this.state.filters,
        method: 'GET',
        restApi: true,
      }),
      getTranslationCatalog(),
    ];

    Promise.all(fetches).then(data => {
      if (data[0]) {
        const searchResults = data[0].data;

        this.setState({
          ...this.state,
          portalType: this.getPortalTypeFromQuery(searchResults),
          results: searchResults.items,
          batching: searchResults.batching,
          translations: data[1],
        });
      }
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
      url: '/@@search',
      params: filters,
      method: 'GET',
      restApi: true,
    }).then(({ data }) => {
      this.setState({
        ...this.state,
        filters,
        results: data.items,
        batching: data.batching,
      });
    });
  }

  getPortalTypeFromQuery(data) {
    let portalType = [];
    data.query.forEach(criteria => {
      if (criteria.i === 'portal_type') {
        portalType = criteria.v;
      }
    });
    return portalType;
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

export default SearchContainer;
