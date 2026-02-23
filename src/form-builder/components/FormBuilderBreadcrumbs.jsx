/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

const FormBuilderBreadcrumbs = (props) => {
  const { routes } = props;
  const indexOfCurrentRoute = routes.findIndex(route => route.path === props.match.path);
  const breadcrumbItems = routes.slice(0, indexOfCurrentRoute)
    // eslint-disable-next-line array-callback-return,consistent-return
    .filter(route => {
      if (!route.siblingPath) return route;
      if (!route.siblingPath.includes(props.match.path)) return route;
    });
  return (<div className="breadcrumbs">
    {breadcrumbItems.map((breadcrumbItem, index) => (<span key={index}>
      <NavLink to={breadcrumbItem.path}>{breadcrumbItem.title}</NavLink>
     </span>)
    )}
    <span>{routes[indexOfCurrentRoute].title}</span>
  </div>);
};

export default FormBuilderBreadcrumbs;


FormBuilderBreadcrumbs.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.object,
  }),
  routes: PropTypes.array,
};
