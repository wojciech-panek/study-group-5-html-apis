import './src/main.scss';

import 'babel-polyfill';

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Router, browserHistory } from 'react-router';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

const reactRoot = window.document.getElementById('react-root');

function renderApp() {
  const routes = require('./src/routes').default;

  render(
    <Router history={browserHistory} routes={routes}/>,
    reactRoot
  );
}

function startApp() {
  renderApp();

  if (module.hot) {
    module.hot.accept('./src/routes', () => {
      unmountComponentAtNode(reactRoot);
      renderApp();
    });
  }
}

startApp();
