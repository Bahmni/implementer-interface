import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import implementerInterface from 'common/reducers';
import Dashboard from 'common/Dashboard';
import FormBuilderContainer from 'form-builder/components/FormBuilderContainer.jsx';
import FormDetailContainer from 'form-builder/components/FormDetailContainer.jsx';
import FormTranslationsContainer from 'form-builder/components/FormTranslationsContainer.jsx';
import 'bahmni-form-controls';
const store = createStore(implementerInterface);
const routes = [
  {
    component: Dashboard,
    exact: true,
    path: '/',
    title: 'Dashboard',
  },
  {
    component: FormBuilderContainer,
    exact: true,
    path: '/form-builder',
    title: 'Form Builder',
  },
  {
    component: FormDetailContainer,
    exact: true,
    path: '/form-builder/:formUuid',
    title: 'Form Details',
    siblingPath: '/form-builder/:formUuid/translate',
  },
  {
    component: FormTranslationsContainer,
    exact: true,
    path: '/form-builder/:formUuid/translate',
    title: 'Form Translate',
    siblingPath: '/form-builder/:formUuid',
  },
];

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
        <Switch>{
          routes.map((route, index) => <Route exact key={index} path={route.path}
            render={
              (routeProps) => React.createElement(route.component,
                Object.assign({}, routeProps, { routes }))}
          />)
        }
        </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('implementer-interface-main')
);
