import React, { Component, PropTypes } from 'react';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { connect } from 'react-redux';
import { deselectControl, removeControlProperties, removeSourceMap }
  from 'form-builder/actions/control';
import NotificationContainer from 'common/Notification';

class FormDetailContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { formData: undefined, notifications: [] };
    this.setState = this.setState.bind(this);
    this.saveFormResource = this.saveFormResource.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    props.dispatch(deselectControl());
    props.dispatch(removeSourceMap());
    props.dispatch(removeControlProperties());
  }

  componentWillMount() {
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,resources:(valueReference,dataType))';
    httpInterceptor
      .get(`${formBuilderConstants.formUrl}/${this.props.params.formUuid}?${params}`)
      .then((data) => this.setState({ formData: data }))
      .catch((error) => this.setErrorMessage(error));
  }

  componentWillUpdate() {
    this.props.dispatch(deselectControl());
    this.props.dispatch(removeSourceMap());
    this.props.dispatch(removeControlProperties());
  }

  setErrorMessage(error) {
    const errorNotification = { message: error.message, type: commonConstants.responseType.error };
    const notificationsClone = this.state.notifications.slice(0);
    notificationsClone.push(errorNotification);
    this.setState({ notifications: notificationsClone });
  }

  saveFormResource(uuid, formJson) {
    httpInterceptor.post(formBuilderConstants.formResourceUrl(uuid), formJson)
      .then(() => {
        const successNotification = {
          message: commonConstants.saveSuccessMessage,
          type: commonConstants.responseType.success,
        };
        const notificationsClone = this.state.notifications.splice(0);
        notificationsClone.push(successNotification);
        const formDataWithUpdatedResource = Object.assign({},
          this.state.formData, { resources: [formJson] });
        this.setState({ notifications: notificationsClone, formData: formDataWithUpdatedResource });
      })
      .catch((error) => this.setErrorMessage(error));
  }

  closeMessage(id) {
    const notificationsClone = this.state.notifications.splice(0);
    notificationsClone.splice(id, 1);
    this.setState({ notifications: notificationsClone });
  }

  render() {
    return (
      <div>
        <NotificationContainer
          closeMessage={(id) => this.closeMessage(id)}
          notifications={this.state.notifications}
        />
        <FormBuilderHeader />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs routes={this.props.routes} />
            </div>
          </div>
        </div>
        <div className="container-content-wrap">
          <div className="container-content">
            <FormDetail
              formData={this.state.formData}
              saveFormResource={ this.saveFormResource }
              setError={this.setErrorMessage}
            />
          </div>
        </div>
      </div>
    );
  }
}

FormDetailContainer.propTypes = {
  dispatch: PropTypes.func,
  params: PropTypes.object.isRequired,
  routes: PropTypes.array,
};

export default connect()(FormDetailContainer);
