import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createHashHistory } from 'history';
import { createStore } from 'redux';
import implementerInterface from 'form-builder/reducers';
import App from 'common/App';
import Dashboard from 'common/Dashboard';
import FormBuilderContainer from 'form-builder/components/FormBuilderContainer';
import FormDetailContainer from 'form-builder/components/FormDetailContainer';
import 'bahmni-form-controls';

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const store = createStore(implementerInterface);

ReactDOM.render(
  <Provider store={store}>
    <Router history={appHistory}>
      <Route component={App} name="Dashboard" path="/">
        <IndexRoute component={Dashboard} name="Dashboard" />
        <Route component={FormBuilderContainer} name="Form Builder" path="form-builder" />
        <Route component={FormDetailContainer} name="Form Details" path="form-builder/:formUuid" />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('implementer-interface-main')
);
