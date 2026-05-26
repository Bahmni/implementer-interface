/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
import FormPrivilegesPreviewContainer from 'form-builder/components/FormPrivilegesPreviewContainer.jsx';
import FormPrinterContainer from 'form-builder/components/FormPrinterContainer.jsx';
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
    component: FormPrinterContainer,
    exact: true,
    path: '/form-printer',
    title: 'Form Printer',
  },
  {
    component: FormDetailContainer,
    exact: true,
    path: '/form-builder/:formUuid',
    title: 'Form Details',
    siblingPath: ['/form-builder/:formUuid/translate', '/form-builder/:formUuid/privilege'],
  },
  {
    component: FormTranslationsContainer,
    exact: true,
    path: '/form-builder/:formUuid/translate',
    title: 'Form Translation',
    siblingPath: ['/form-builder/:formUuid', '/form-builder/:formUuid/privilege'],
  },
  {
    component: FormPrivilegesPreviewContainer,
    exact: true,
    path: '/form-builder/:formUuid/privilege',
    title: 'Show Form Privileges',
    siblingPath: ['/form-builder/:formUuid'],
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
