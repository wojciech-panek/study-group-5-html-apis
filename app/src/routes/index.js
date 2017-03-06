import React from 'react';
import {Route} from 'react-router';

import App from './app.component';
import HomeRoute from './home';
import MasterRoute from './master';
import SlaveRoute from './slave';
import UnsupportedRoute from './unsupported';

export default (
  <Route path="/" component={App}>
    {SlaveRoute},
    {MasterRoute},
    {UnsupportedRoute}
  </Route>
);
