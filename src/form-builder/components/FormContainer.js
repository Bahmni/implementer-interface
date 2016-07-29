import React, { Component, PropTypes } from 'react';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import Form from 'form-builder/components/Form';

export default class FormContainer extends Component {

  constructor() {
    super();
    this.state = { formData: {} };
    this.setState = this.setState.bind(this);
  }

  componentWillMount() {
    const params = 'v=custom:(id,uuid,name,version,published,auditInfo)';
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}/${this.props.params.formUuid}?${params}`)
      .then((data) => this.setState({ formData: data }))
      .catch((error) => this.setState({ error }));
  }

  render() {
    return (<Form formData={this.state.formData} />);
  }
}

FormContainer.propTypes = {
  params: PropTypes.object.isRequired,
};
