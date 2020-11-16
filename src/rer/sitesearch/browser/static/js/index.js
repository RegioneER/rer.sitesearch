import '../styles/index.less';

import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './SearchContainer';

const rootElement = document.getElementById('sitesearch');
const baseUrl = document.body.getAttribute('data-base-url');

if (rootElement) {
  ReactDOM.render(<SearchContainer baseUrl={baseUrl} />, rootElement);
}
