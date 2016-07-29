import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';
import App from 'common/App';
import Dashboard from 'common/Dashboard';
import FormBuilderContainer from 'form-builder/components/FormBuilderContainer';
import FormContainer from 'form-builder/components/FormContainer';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={App} path="/">
      <IndexRoute component={Dashboard} />
      <Route component={FormBuilderContainer} path="form-builder" />
      <Route component={FormContainer} path="form-builder/:formUuid" />
    </Route>
  </Router>,
  document.getElementById('implementer-interface-main')
);
