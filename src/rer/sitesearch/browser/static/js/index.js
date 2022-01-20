import '../styles/index.less';
import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './SearchContainer';
// import JsonWidgetContainer from './json_widget/JsonWidgetContainer';

const root = document.getElementById('sitesearch');
const baseUrl = document.body.getAttribute('data-base-url');
const searchEndpoint = root.getAttribute('data-search-endpoint') || 'search';

if (root) {
  ReactDOM.render(
    <SearchContainer baseUrl={baseUrl} searchEndpoint={searchEndpoint} />,
    root,
  );
}
