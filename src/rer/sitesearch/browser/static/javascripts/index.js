import React from 'react';
import ReactDOM from 'react-dom';
import ExampleContainer from './ExampleContainer';

const rootElement = document.getElementById('sitesearch');

if (rootElement) {
  ReactDOM.render(<ExampleContainer />, rootElement);
}
