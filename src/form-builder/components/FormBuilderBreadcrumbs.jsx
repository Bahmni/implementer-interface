import React from 'react';
import PropTypes from 'prop-types';
const Breadcrumbs = require('react-breadcrumbs');

export const FormBuilderBreadcrumbs = ({ routes }) =>
  <Breadcrumbs routes={routes} separator="" />;


FormBuilderBreadcrumbs.propTypes = {
  routes: PropTypes.array,
};
