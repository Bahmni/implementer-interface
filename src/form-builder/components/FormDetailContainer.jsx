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
    this.publishForm = this.publishForm.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.editForm = this.editForm.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onPublish = this.onPublish.bind(this);
    props.dispatch(deselectControl());
    props.dispatch(removeSourceMap());
    props.dispatch(removeControlProperties());
  }


  componentWillMount() {
    const params =
      'v=custom:(id,uuid,name,version,published,auditInfo,' +
      'resources:(valueReference,dataType,uuid))';
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

  onSave() {
    try {
      const formJson = this.getFormJson();
      const formName = this.state.formData ? this.state.formData.name : 'FormName';
      const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
        this.state.formData.resources[0].uuid : '';
      const formResource = {
        form: {
          name: formName,
          uuid: this.state.formData.uuid,
        },
        valueReference: JSON.stringify(formJson),
        dataType: formBuilderConstants.formResourceDataType,
        uuid: formResourceUuid,
      };
      this.saveFormResource(formJson.uuid, formResource);
    } catch (e) {
      this.setErrorMessage(e.getException());
    }
  }

  onEdit() {
    try {
      const confirmResult = confirm('Edit of the form will allow you to ' +
        'create a new version of form. Do you want to proceed?');
      if (confirmResult) {
        this.editForm();
      }
    } catch (e) {
      this.setErrorMessage(e.getException());
    }
  }

  onPublish() {
    try {
      const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
      this.publishForm(formUuid);
    } catch (e) {
      this.setErrorMessage(e.getException());
    }
  }

  getFormJson() {
    if (this.formDetail) {
      return this.formDetail.getFormJson();
    }
    return null;
  }

  setErrorMessage(error) {
    const errorNotification = { message: error.message, type: commonConstants.responseType.error };
    const notificationsClone = this.state.notifications.slice(0);
    notificationsClone.push(errorNotification);
    this.setState({ notifications: notificationsClone });
  }

  showPublishButton() {
    const isPublished = this.state.formData ? this.state.formData.published : false;
    if (!isPublished) {
      return (
        <button className="publish-button" onClick={ this.onPublish }>Publish</button>
      );
    }
    return null;
  }

  showSaveOrEditButton() {
    const isEditable = this.state.formData ? this.state.formData.editable : false;
    const isPublished = this.state.formData ? this.state.formData.published : false;
    if (isPublished && !isEditable) {
      return (<button className="fr edit-button" onClick={ this.onEdit }>Edit</button>);
    }
    return (<button className="fr save-button" onClick={ this.onSave }>Save</button>);
  }

  editForm() {
    const formData = this.state.formData;
    formData.editable = true;
    formData.version = '  ';
    this.setState({ formData });
  }

  saveFormResource(uuid, formJson) {
    httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then((response) => {
        const uuid2 = response.form.uuid;
        this.context.router.push(`/form-builder/${uuid2}`);
        const successNotification = {
          message: commonConstants.saveSuccessMessage,
          type: commonConstants.responseType.success,
        };
        const notificationsClone = this.state.notifications.splice(0);
        notificationsClone.push(successNotification);
        this.setState({ notifications: notificationsClone,
          formData: this.formResourceMapper(response) });
      })
      .catch((error) => this.setErrorMessage(error));
  }

  publishForm(formUuid) {
    httpInterceptor.post(formBuilderConstants.bahmniFormPublishUrl(formUuid))
      .then((response) => {
        const successNotification = {
          message: commonConstants.publishSuccessMessage,
          type: commonConstants.responseType.success,
        };
        const notificationsClone = this.state.notifications.splice(0);
        notificationsClone.push(successNotification);
        const publishedFormData = Object.assign({}, this.state.formData);
        publishedFormData.published = response.published;
        this.setState({ notifications: notificationsClone, formData: publishedFormData });
      })
      .catch((error) => this.setErrorMessage(error));
  }

  formResourceMapper(responseObject) {
    const form = Object.assign({}, responseObject.form);
    const formResource = { name: form.name,
      dataType: responseObject.dataType,
      valueReference: responseObject.valueReference,
      uuid: responseObject.uuid };
    form.resources = [formResource];
    return form;
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
            {this.showSaveOrEditButton()}
            {this.showPublishButton()}
          </div>
        </div>
        <div className="container-content-wrap">
          <div className="container-content">
            <FormDetail
              editForm={ this.editForm }
              formData={this.state.formData}
              publishForm={ this.publishForm }
              ref={r => { this.formDetail = r; }}
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

FormDetailContainer.contextTypes = {
  router: React.PropTypes.object.isRequired,
};


export default connect()(FormDetailContainer);
