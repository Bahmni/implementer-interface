import React, { PropTypes } from 'react';
var Breadcrumbs = require('react-breadcrumbs');

var FormBuilderBreadcrumbs = React.createClass({
  render: function() {
    return (
      <div>
        <Breadcrumbs routes={this.props.routes} separator=" > " />
      </div>
    );
  },
});

export default FormBuilderBreadcrumbs;

FormBuilderBreadcrumbs.propTypes = {
  routes: PropTypes.array,
};
