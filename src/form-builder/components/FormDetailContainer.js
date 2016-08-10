import React, { Component, PropTypes } from 'react';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import FormDetail from 'form-builder/components/FormDetail';
import FormBuilderHeader from './FormBuilderHeader';

export default class FormDetailContainer extends Component {

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
    return (
        <div>
          <FormBuilderHeader />
          <div className="breadcrumb-wrap">
              <div className="breadcrumb">
                  <div className="fl">
                      <ul>
                        <li>My Forms</li>
                      </ul>
                  </div>
              </div>
          </div>
          <div className="container-content-wrap">
            <div className="container-content">
              <FormDetail formData={this.state.formData} />
            </div>
          </div>
        </div>
    );
  }
}

FormDetailContainer.propTypes = {
  params: PropTypes.object.isRequired,
};
