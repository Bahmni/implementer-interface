import React, { Component, PropTypes } from 'react';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import FormDetail from 'form-builder/components/FormDetail';
import FormBuilderHeader from './FormBuilderHeader';
import { FormBuilderBreadcrumbs } from './FormBuilderBreadcrumbs';

export default class FormDetailContainer extends Component {

  constructor() {
    super();
    this.state = { formData: undefined };
    this.setState = this.setState.bind(this);
    this.saveForm = this.saveForm.bind(this);
  }

  componentWillMount() {
    const params = 'v=custom:(id,uuid,name,version,published,auditInfo,resources)';
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}/${this.props.params.formUuid}?${params}`)
      .then((data) => this.setState({ formData: data }))
      .catch((error) => this.setState({ error }));
  }

  saveForm(uuid, formJson) {
    httpInterceptor.post(formBuilderConstants.formResourceUrl(uuid), formJson);
  }

  render() {
    return (
      <div>
        <FormBuilderHeader />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb">
            <div className="fl">
              <div className="fl">
                <FormBuilderBreadcrumbs routes={this.props.routes} />
              </div>
            </div>
          </div>
        </div>
        <div className="container-content-wrap">
          <div className="container-content">
            <FormDetail formData={this.state.formData} saveForm={ this.saveForm } />
          </div>
        </div>
      </div>
    );
  }
}

FormDetailContainer.propTypes = {
  params: PropTypes.object.isRequired,
  routes: PropTypes.array,
};
