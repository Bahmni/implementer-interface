import React, { PropTypes } from 'react';
const Breadcrumbs = require('react-breadcrumbs');

export const FormBuilderBreadcrumbs = ({ routes }) =>
  <Breadcrumbs routes={routes} separator="" />;


FormBuilderBreadcrumbs.propTypes = {
  routes: PropTypes.array,
};
