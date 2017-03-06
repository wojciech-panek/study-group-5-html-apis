import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './app.component';

import Master from '../components/master';
import Slave from '../components/slave';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Slave} />
    <Route path="master" component={Master} />
  </Route>
);
