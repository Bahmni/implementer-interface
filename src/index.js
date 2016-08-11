import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import App from 'common/App';
import Dashboard from 'common/Dashboard';
import FormBuilderContainer from 'form-builder/components/FormBuilderContainer';
import FormDetailContainer from 'form-builder/components/FormDetailContainer';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });

ReactDOM.render(
  <Router history={appHistory}>
    <Route component={App} name="Dashboard" path="/">
      <IndexRoute component={Dashboard} name="Dashboard" />
      <Route component={FormBuilderContainer} name="Form Builder" path="form-builder" />
      <Route component={FormDetailContainer} name="Form Details" path="form-builder/:formUuid" />
    </Route>
  </Router>,
  document.getElementById('implementer-interface-main')
);
