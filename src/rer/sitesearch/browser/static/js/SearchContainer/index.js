import React, { Component } from 'react';
import SearchFilters from '../SearchFilters';
import SearchResults from '../SearchResults';
import SpecificFilters from '../SpecificFilters';
import SearchContext from '../utils/searchContext';
import { getTranslationCatalog } from '../utils/i18n';
import apiFetch, { updateHistory } from '../utils/apiFetch';
import qs from 'query-string';
import debounce from 'lodash.debounce';
import DataObjectParser from 'dataobject-parser';

import PropTypes from 'prop-types';

const fixQuery = ({ params, facets }) => {
  const newParams = JSON.parse(JSON.stringify(params));
  const { group, SearchableText } = newParams;
  if (group && facets && facets.groups) {
    newParams['portal_type'] = facets.groups.values[group].types;
    delete newParams.group;
  }
  if (
    SearchableText &&
    SearchableText.length > 0 &&
    SearchableText.indexOf('*') !== SearchableText.length
  ) {
    newParams.SearchableText = `${newParams.SearchableText}*`;
  }
  return newParams;
};

const nullState = {
  filters: null,
  results: [],
  loading: false,
};

class SearchContainer extends Component {
  constructor(props) {
    super(props);

    const requestQuery = qs.parse(window.location.search);
    const query = requestQuery
      ? DataObjectParser.transpose(requestQuery).data()
      : {};
    this.setFacets = facets => this.setState({ facets });

    this.setFilters = newFilters => {
      let filters = null;
      if (newFilters === null) {
        this.setState({
          ...nullState,
        });
      } else {
        filters = JSON.parse(JSON.stringify(this.state.filters));

        // always clean batching
        delete filters.b_start;

        Object.keys(newFilters).forEach(key => {
          const value = newFilters[key];
          if (value) {
            filters[key] = value;
          } else if (key in filters) {
            delete filters[key];
          }
        });
      }

      if (!this.state.loading) this.setState({ loading: true });

      updateHistory({ url: `${this.props.baseUrl}/@@search`, params: filters });

      apiFetch({
        url: this.props.baseUrl + '/@search',
        params: fixQuery({ params: filters, facets: this.state.facets }),
        method: 'GET',
      }).then(({ data }) => {
        this.setState({
          filters,
          results: data.items,
          facets: data.facets,
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
      loading: Object.keys(query).length > 0,
      query: Object.keys(query).length > 0 ? query : null,
      batching: { numpages: 0, current_page: 0, pagesize: 0 },
      translations: {},
      filters: {
        ...query,
      },
      setFacets: this.setFacets,
      setFilters: debounce(this.setFilters, 100),
      isMobile: window.innerWidth < 1200,
    };
  }

  handleResize() {
    this.setState({
      isMobile: window.innerWidth < 1200,
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    const { query, facets } = this.state;
    const fetches = [getTranslationCatalog()];

    const endPoint = '/@search';
    updateHistory({ url: `${this.props.baseUrl}/@@search`, params: query });

    fetches.push(
      apiFetch({
        url: this.props.baseUrl + endPoint,
        params: fixQuery({ params: query, facets }),
        method: 'GET',
      }),
    );

    Promise.all(fetches).then(data => {
      let newState = { ...this.state };
      if (data[0]) {
        newState = { ...newState, translations: data[0] };
      }
      if (data[1]) {
        const searchResults = data[1].data;

        newState = {
          ...newState,
          results: searchResults.items,
          facets: searchResults.facets,
          total: searchResults.items_total,
          batching: searchResults.batching,
          loading: false,
        };
      } else {
        newState = { ...newState, loading: false };
      }
      this.setState(newState);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    const { isMobile, filters, facets } = this.state;
    const showSearchContainer =
      !isMobile &&
      filters &&
      filters.group &&
      facets &&
      facets.groups &&
      facets.groups.values[filters.group] &&
      facets.groups.values[filters.group].advanced_filters;
    return (
      <div className="rer-search-container">
        <SearchContext.Provider value={this.state}>
          <div className="row" aria-live="polite">
            <div className="col col-md-3">
              <SearchFilters baseUrl={this.props.baseUrl} />
            </div>
            <div className="col col-md-9">
              {showSearchContainer && <SpecificFilters id="search-container" />}
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
