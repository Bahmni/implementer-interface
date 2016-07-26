import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList';

export default class FormBuilder extends Component {

  getData() {
    return this.props.data;
  }

  render() {
    return this.props.error ? <div>Error</div> : <FormList data={this.getData()} />;
  }
}

FormBuilder.propTypes = {
  data: PropTypes.array.isRequired,
  error: PropTypes.object,
};
