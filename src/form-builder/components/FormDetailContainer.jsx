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
import EditModal from 'form-builder/components/EditModal.jsx';

class FormDetailContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { formData: undefined, showModal: false, notifications: [] };
    this.setState = this.setState.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.onSave = this.onSave.bind(this);
    this.openFormModal = this.openFormModal.bind(this);
    this.closeFormModal = this.closeFormModal.bind(this);
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
      this._saveFormResource(formJson.uuid, formResource);
    } catch (e) {
      this.setErrorMessage(e.getException());
    }
  }

  onPublish() {
    try {
      const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
      this._publishForm(formUuid);
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

  closeFormModal() {
    this.setState({ showModal: false });
  }

  openFormModal() {
    this.setState({ showModal: true });
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

  showSaveButton() {
    const isEditable = this.state.formData ? this.state.formData.editable : false;
    const isPublished = this.state.formData ? this.state.formData.published : false;
    if (!isPublished || isEditable) {
      return (
          <button className="fr save-button btn--highlight" onClick={ this.onSave }>Save</button>
      );
    }
    return null;
  }
  showEditButton() {
    const isEditable = this.state.formData ? this.state.formData.editable : false;
    const isPublished = this.state.formData ? this.state.formData.published : false;
    if (isPublished && !isEditable) {
      return (
        <div className="info-view-mode-wrap">
          <div className="info-view-mode">
            <i className="fa fa-info-circle fl"></i>
            <span className="info-message">
              This <strong>Form</strong> is a <strong>Published</strong> version.
              For editing click on
            </span>
            <button className="fr edit-button" onClick={() => this.openFormModal()}>Edit</button>
            <EditModal
              closeModal={() => this.closeFormModal()}
              editForm={(formData) => this.editForm(this.state.formData)}
              showModal={this.state.showModal}
            />
          </div>
        </div>
      );
    }
    return null;
  }

  editForm(formData) {
    this.state.formData.editable = true;
    this.state.formData.version = '  ';
    this.setState({ formData });
  }

  _saveFormResource(uuid, formJson) {
    httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then((response) => {
        const updatedUuid = response.form.uuid;
        this.context.router.push(`/form-builder/${updatedUuid}`);
        const successNotification = {
          message: commonConstants.saveSuccessMessage,
          type: commonConstants.responseType.success,
        };
        const notificationsClone = this.state.notifications.splice(0);
        notificationsClone.push(successNotification);
        this.setState({ notifications: notificationsClone,
          formData: this._formResourceMapper(response) });
      })
      .catch((error) => this.setErrorMessage(error));
  }

  _publishForm(formUuid) {
    httpInterceptor.post(formBuilderConstants.bahmniFormPublishUrl(formUuid))
      .then((response) => {
        const successNotification = {
          message: commonConstants.publishSuccessMessage,
          type: commonConstants.responseType.success,
        };
        const notificationsClone = this.state.notifications.splice(0);
        notificationsClone.push(successNotification);
        const publishedFormData = Object.assign({}, this.state.formData,
          { published: response.published, version: response.version });
        this.setState({ notifications: notificationsClone, formData: publishedFormData });
      })
      .catch((error) => this.setErrorMessage(error));
  }

  _formResourceMapper(responseObject) {
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
            <div className="fr">
              {this.showSaveButton()}
              {this.showPublishButton()}
            </div>
          </div>
        </div>
        <div className="container-content-wrap">
          <div className="container-content">
            {this.showEditButton()}
            <FormDetail
              formData={this.state.formData}
              ref={r => { this.formDetail = r; }}
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
