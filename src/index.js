import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from 'common/App';
import Dashboard from 'common/Dashboard';
import FormBuilder from 'form-builder/components/FormBuilder';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={App} path="/">
      <IndexRoute component={Dashboard} />
      <Route component={FormBuilder} path="form-builder" />
    </Route>
  </Router>,
  document.getElementById('implementer-interface-main')
);
