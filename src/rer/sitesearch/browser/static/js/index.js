import React from 'react';
import ReactDOM from 'react-dom';
import SearchContainer from './SearchContainer';

const rootElement = document.getElementById('sitesearch');

if (rootElement) {
  ReactDOM.render(<SearchContainer />, rootElement);
}
