import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from './common/App';
import Dashboard from './common/Dashboard'
import FormBuilder from './form-builder/components/FormBuilder';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard}></IndexRoute>
      <Route path="form-builder" component={FormBuilder}></Route>
    </Route>
  </Router>,
  document.getElementById('implementer-interface-main')
);
