import React, { Component, PropTypes } from 'react';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { connect } from 'react-redux';
import { blurControl, deselectControl, removeControlProperties, removeSourceMap }
    from 'form-builder/actions/control';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';
import EditModal from 'form-builder/components/EditModal.jsx';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import isEmpty from 'lodash/isEmpty';
import FormHelper from 'form-builder/helpers/formHelper';
import formHelper from '../helpers/formHelper';
import get from 'lodash/get';


export class FormDetailContainer extends Component {

    constructor(props) {
        super(props);
        this.timeoutId = undefined;
        this.state = { formData: undefined, showModal: false, notification: {},
            httpReceived: false, loading: true, formList: [], originalFormName: undefined };
        this.setState = this.setState.bind(this);
        this.setErrorMessage = this.setErrorMessage.bind(this);
        this.onSave = this.onSave.bind(this);
        this.openFormModal = this.openFormModal.bind(this);
        this.closeFormModal = this.closeFormModal.bind(this);
        this.onPublish = this.onPublish.bind(this);
        this.cloneFormResource = this.cloneFormResource.bind(this);
        props.dispatch(deselectControl());
        props.dispatch(removeSourceMap());
        props.dispatch(removeControlProperties());
        props.dispatch(blurControl());
    }

    componentDidMount() {
        const params =
            'v=custom:(id,uuid,name,version,published,auditInfo,' +
            'resources:(value,dataType,uuid))';
        httpInterceptor
            .get(`${formBuilderConstants.formUrl}/${this.props.params.formUuid}?${params}`)
            .then((data) => this.setState({ formData: data, httpReceived: true,
                loading: false, originalFormName: data.name }))
            .catch((error) => {
                this.setErrorMessage(error);
                this.setState({ loading: false });
            });
        // .then is untested

        this.getFormList();
    }

    componentWillUpdate() {
        this.props.dispatch(deselectControl());
        this.props.dispatch(blurControl());
        this.props.dispatch(removeControlProperties());
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutID);
    }

    onSave() {
        try {
            const formJson = this.getFormJson();
            const formName = this.state.formData ? this.state.formData.name : 'FormName';
            const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
            const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
                this.state.formData.resources[0].uuid : '';
            const formResource = {
                form: {
                    name: formName,
                    uuid: formUuid,
                },
                value: JSON.stringify(formJson),
                uuid: formResourceUuid,
            };
            this._saveFormResource(formResource);
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
        this.setState({ notification: errorNotification });
        setTimeout(() => {
            this.setState({ notification: {} });
        }, commonConstants.toastTimeout);
    }

    getFormList() {
        httpInterceptor
            .get(formBuilderConstants.formUrl)
            .then((response) => {
                this.setState({ formList: response.results });
            })
            .catch((error) => this.showErrors(error));
    }

    closeFormModal() {
        this.setState({ showModal: false });
    }

    openFormModal() {
        this.setState({ showModal: true });
    }

    showPublishButton() {
        const isPublished = this.state.formData ? this.state.formData.published : false;
        const isEditable = this.state.formData ? this.state.formData.editable : false;
        const resourceData = FormHelper.getFormResourceControls(this.state.formData);
        if ((!isPublished || isEditable) && this.state.httpReceived) {
            return (
                <button
                    className="publish-button"
                    disabled={ isPublished || isEmpty(resourceData) }
                    onClick={ this.onPublish }
                >Publish</button>
            );
        }
        return null;
    }

    showSaveButton() {
        const isEditable = this.state.formData ? this.state.formData.editable : false;
        const isPublished = this.state.formData ? this.state.formData.published : false;
        if ((!isPublished || isEditable) && this.state.httpReceived) {
            return (
                <button
                    className="fr save-button btn--highlight"
                    onClick={ this.state.formData &&
                    this.state.originalFormName !== this.state.formData.name ?
                        this.cloneFormResource : this.onSave }
                >Save</button>
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
              This Form is a Published version.
              For editing click on
            </span>
                    <button className="fr edit-button"
                            onClick={() => this.openFormModal()}
                    >Edit</button>
                    <EditModal
                        closeModal={() => this.closeFormModal()}
                        editForm={() => this.editForm()}
                        showModal={this.state.showModal}
                    />
                  </div>
                </div>
            );
        }
        return null;
    }

    editForm() {
        const editableFormData = Object.assign(
            {}, this.state.formData,
            { editable: true }
        );

        this.setState({ formData: editableFormData });
    }

    _saveFormResource(formJson) {
        this.setState({ loading: true });
        httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
            .then((response) => {
                const updatedUuid = response.form.uuid;
                this.context.router.push(`/form-builder/${updatedUuid}`);
                const successNotification = {
                    message: commonConstants.saveSuccessMessage,
                    type: commonConstants.responseType.success,
                };
                this.setState({ notification: successNotification,
                    formData: this._formResourceMapper(response), loading: false });

                clearTimeout(this.timeoutID);
                this.timeoutID = setTimeout(() => {
                    this.setState({ notification: {} });
                }, commonConstants.toastTimeout);
            })
            .catch((error) => {
                this.setErrorMessage(error);
                this.setState({ loading: false });
            });
    }

    _publishForm(formUuid) {
        this.setState({ loading: true });
        httpInterceptor.post(new UrlHelper().bahmniFormPublishUrl(formUuid))
            .then((response) => {
                const successNotification = {
                    message: commonConstants.publishSuccessMessage,
                    type: commonConstants.responseType.success,
                };
                const publishedFormData = Object.assign({}, this.state.formData,
                    { published: response.published, version: response.version });
                this.setState({ notification: successNotification,
                    formData: publishedFormData, loading: false });

                clearTimeout(this.timeoutID);
                this.timeoutID = setTimeout(() => {
                    this.setState({ notification: {} });
                }, commonConstants.toastTimeout);
            })
            .catch((error) => {
                this.setErrorMessage(error);
                this.setState({ loading: false });
            });
    }

    _formResourceMapper(responseObject) {
        const form = Object.assign({}, responseObject.form);
        const formResource = { name: form.name,
            dataType: responseObject.dataType,
            value: responseObject.value,
            uuid: responseObject.uuid };
        form.resources = [formResource];
        return form;
    }

    updateFormName(formName) {
        let currentFormName = formName;
        if (formHelper.validateFormName(formName)) {
            const existForms = this.state.formList.filter(
                form => form.display === formName && this.state.originalFormName !== formName);
            if (existForms.length > 0) {
                this.setErrorMessage({ message: 'Form with same name already exists' });
                currentFormName = this.state.originalFormName;
            }
        } else {
            this.setErrorMessage({ message: 'Leading or trailing spaces and ^/-. are not allowed' });
            currentFormName = this.state.originalFormName;
        }
        const newFormData = Object.assign({}, this.state.formData, { name: currentFormName });
        this.setState({ formData: newFormData });
        return currentFormName;
    }

    showErrors(error) {
        if (error.response) {
            error.response.json().then((data) => {
                const message = get(data, 'error.globalErrors[0].message') || error.message;
                this.setErrorMessage({ message });
            });
        } else {
            this.setErrorMessage({ message: error.message });
        }
    }

    validateNameLength(value) {
        if (value.length === 50) {
            this.setErrorMessage({ message: 'Form name shall not exceed 50 characters' });
            return true;
        }

        return false;
    }

    cloneFormResource() {
        const newVersion = '1';
        const isPublished = false;
        const form = {
            name: this.state.formData.name,
            version: newVersion,
            published: isPublished,
        };
        httpInterceptor
            .post(formBuilderConstants.formUrl, form)
            .then((response) => {
                const newFormData = Object.assign({}, this.state.formData,
                    { uuid: response.uuid, id: response.id, published: isPublished,
                        version: newVersion, resources: [] });
                this.setState({ formData: newFormData, originalFormName: newFormData.name });
                this.onSave();
            })
            .catch((error) => this.showErrors(error));
    }

    render() {
        return (
            <div>
              <Spinner show={this.state.loading} />
              <NotificationContainer
                  notification={this.state.notification}
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
                      updateFormName={(formName) => this.updateFormName(formName)}
                      validateNameLength={(formName) => this.validateNameLength(formName)}
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
