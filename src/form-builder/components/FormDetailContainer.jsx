import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { commonConstants } from 'common/constants';
import FormDetail from 'form-builder/components/FormDetail.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { connect } from 'react-redux';
import {
  blurControl,
  deselectControl,
  removeControlProperties,
  removeSourceMap,
  formLoad,
  setChangedProperty,
  formDefVersionUpdate,
} from 'form-builder/actions/control';
import NotificationContainer from 'common/Notification';
import Spinner from 'common/Spinner';
import EditModal from 'form-builder/components/EditModal.jsx';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';
import isEmpty from 'lodash/isEmpty';
import FormHelper from 'form-builder/helpers/formHelper';
import formHelper from '../helpers/formHelper';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { clearTranslations } from '../actions/control';
import { formEventUpdate, saveEventUpdate } from '../actions/control';
import { Exception } from 'form-builder/helpers/Exception';
import {
  saveFormNameTranslations,
  saveTranslations,
} from 'common/apis/formTranslationApi';
import FormPreviewModal from 'form-builder/components/FormPreviewModal.jsx';
import Popup from 'reactjs-popup';
import { saveFormPrivileges } from 'common/apis/formPrivilegesApi';

export class FormDetailContainer extends Component {
  constructor(props) {
    super(props);
    this.timeoutId = undefined;
    this.formPrivileges = undefined;
    this.state = {
      formData: undefined,
      showModal: false,
      showPreview: false,
      notification: {},
      httpReceived: false,
      loading: true,
      formList: [],
      formControls: [],
      originalFormName: undefined,
      formEvents: {},
      referenceVersion: undefined,
      referenceFormUuid: undefined,
      formPreviewJson: undefined,
      formPrivileges: [],
      formDefinitionVersion: undefined,
    };
    this.setState = this.setState.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.getFormJson = this.getFormJson.bind(this);
    this.onSave = this.onSave.bind(this);
    this.openFormModal = this.openFormModal.bind(this);
    this.closeFormModal = this.closeFormModal.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.cloneFormResource = this.cloneFormResource.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.generateFormPreviewJson = this.generateFormPreviewJson.bind(this);
    this.handleUpdateFormControlEvents = this.handleUpdateFormControlEvents.bind(this);
    this.getFormResource = this.getFormResource.bind(this);
    props.dispatch(deselectControl());
    props.dispatch(removeSourceMap());
    props.dispatch(removeControlProperties());
    props.dispatch(blurControl());
    props.dispatch(clearTranslations());
  }

  componentDidMount() {
    const params =
      'v=custom:(id,uuid,build,name,version,published,auditInfo,' +
      'resources:(value,dataType,uuid))';
    httpInterceptor
      .get(
        `${formBuilderConstants.formUrl}/${this.props.match.params.formUuid}?${params}`
      )
      .then((data) => {
        const parsedFormValue =
          data.resources.length > 0 ? JSON.parse(data.resources[0].value) : {};
        const formDefVersion = parsedFormValue.formDefVersion || 1.0;
        this.setState({
          formData: data,
          httpReceived: true,
          loading: false,
          originalFormName: data.name,
          // eslint-disable-next-line eqeqeq
          referenceVersion: data.version == 1 ?
              0 : parsedFormValue.referenceVersion,
          // eslint-disable-next-line eqeqeq
          referenceFormUuid: data.version == 1 ?
              data.uuid : parsedFormValue.referenceFormUuid,
          formDefinitionVersion: formDefVersion,
        });
        this._getFormPrivilegesFromDB(data.id, data.version);
        const formControlsArray = formHelper.getObsControlEvents(parsedFormValue);
        this.props.dispatch(formDefVersionUpdate(formDefVersion));
        this.props.dispatch(formLoad(formControlsArray));
      })
      .catch((error) => {
        this.setErrorMessage(error);
        this.setState({ loading: false });
      });
    // .then is untested

    this.getFormList();
  }

  componentWillUpdate(nextProps, nextState) {
    if (!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) {
      this.props.dispatch(deselectControl());
      this.props.dispatch(blurControl());
      this.props.dispatch(removeControlProperties());

      const updatedFormEvents = this.getFormEvents();
      if (updatedFormEvents) {
        this.formEvents = this.formEvents || {};
        if (this.formEvents.onFormInit !== updatedFormEvents.onFormInit) {
          this.props.dispatch(formEventUpdate(updatedFormEvents.onFormInit));
        }
        if (this.formEvents.onFormSave !== updatedFormEvents.onFormSave) {
          this.props.dispatch(saveEventUpdate(updatedFormEvents.onFormSave));
        }
        this.formEvents = updatedFormEvents;
      }
      const updatedFormPrivileges = this.getFormPrivileges();
      if (updatedFormPrivileges) {
        this.props.dispatch(formPrivilegesEventUpdate(updatedFormPrivileges));
        this.formPrivileges = updatedFormPrivileges;
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutID);
  }

  getFormResource() {
    const formJson = this.getFormJson();
    if (this.hasEmptyBlocks(formJson)) {
      const emptySectionOrTable = formBuilderConstants.exceptionMessages.emptySectionOrTable;
      throw new Exception(emptySectionOrTable);
    }
    formJson.events = this.state.formEvents;
    const formDefVersion = (this.props.formDetails && this.props.formDetails.formDefVersion) || this.state.formDefinitionVersion;
    formJson.formDefVersion = formDefVersion;
    const formName = this.state.formData ? this.state.formData.name : 'FormName';
    const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
    const formResourceUuid = this.state.formData && this.state.formData.resources.length > 0 ?
        this.state.formData.resources[0].uuid : '';
    formJson.translationsUrl = formBuilderConstants.translationsUrl;
    formJson.referenceVersion = this.state.referenceVersion;
    formJson.referenceFormUuid = this.state.referenceFormUuid;
    formJson.privilege = this.state.privilege;
    return {
      form: {
        name: formName,
        uuid: formUuid,
      },
      value: JSON.stringify(formJson),
      uuid: formResourceUuid,
    };
  }

  onSave() {
    try {
      const initialPrivileges = [];
      const formId = this.state.formData.id;
      const formVersion = this.state.formData.version;
      const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${formId}&formVersion=${formVersion}`;
      httpInterceptor.get(optionsUrl).then((initialPrivilegesFromDB) => {
        initialPrivilegesFromDB.forEach((privilege) => {
          initialPrivileges.push(privilege);
        });
        this.setState({ formPrivileges: initialPrivileges, loading: false });
        const formResource = this.getFormResource();
        this._saveFormResource(formResource);
        this._saveFormPrivileges(this.state.formData.id,
            this.state.formData.version, this.state.formPrivileges);
      });
    } catch (error) {
      // this.setErrorMessage(error.getException());
    }
  }

  _getFormPrivilegesFromDB(formId, formVersion) {
    const initialPrivileges = [];
    const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${formId}&formVersion=${formVersion}`;
    httpInterceptor.get(optionsUrl).then((initialPrivilegesFromDB) => {
      initialPrivilegesFromDB.forEach((privilege, key) => {
        initialPrivileges.push(privilege);
      });
      this.setState({ formPrivileges: initialPrivileges, loading: false });
    });
  }
  _saveFormPrivileges(formId, formVersion) {
    let formVersionTemp = formVersion;
    saveFormPrivileges(
      this._createReqObject(formId, formVersionTemp, this.state.formPrivileges)
    )
      .then(() => {
        const message = 'Form Privileges saved successfully';
        this.setMessage(message, commonConstants.responseType.success);
        this.setState({ loading: false });
      })
      .catch(() => {
        this.setErrorMessage('Failed to save Privileges');
        this.setState({ loading: false });
      });
  }

  _createReqObject(formId, formVersion, formPrivileges) {
    const formPrivilegeObj = [];
    for (let i = 0; i < formPrivileges.length; i++) {
      const privilege = formPrivileges[i];
      const privilegeCopy = {
        formId,
        privilegeName: privilege.privilegeName,
        editable: privilege.editable,
        viewable: privilege.viewable,
        formVersion,
      };
      formPrivilegeObj.push(privilegeCopy);
    }
    return formPrivilegeObj;
  }

  onPublish() {
    try {
      const initialPrivileges = [];
      const formId = this.state.formData.id;
      const formVersion = this.state.formData.version;
      const optionsUrl = `${formBuilderConstants.getFormPrivilegesUrl}?formId=${formId}&formVersion=${formVersion}`;
      httpInterceptor.get(optionsUrl).then((initialPrivilegesFromDB) => {
        initialPrivilegesFromDB.forEach((privilege) => {
          initialPrivileges.push(privilege);
        });
        this.setState({ formPrivileges: initialPrivileges, loading: false });
        const formJson = this.getFormResource();
        httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
            .then((response) => {
              this.setFormData(response);
              const formUuid = this.state.formData ? this.state.formData.uuid : undefined;
              const { translations } = this.props;
              const defaultLocale = this.props.defaultLocale ||
                  localStorage.getItem('openmrsDefaultLocale');
              const defaultTranslations =
                  this._createTranslationReqObject(translations, defaultLocale);
              this._saveTranslationsAndPublishForm(formUuid, defaultTranslations);
              this._saveFormPrivileges(this.state.formData.id,
                  this.state.formData.version, this.state.formPrivileges);
            })
            .catch((error) => {
              this.setErrorMessage(error);
              this.setState({ loading: false });
            });
      });
    } catch (e) {
      (e.getException());
    }
  }

  setFormData(response) {
    const updatedUuid = response.form.uuid;
    this.context.router.history.push(`/form-builder/${updatedUuid}`);
    const successNotification = {
      message: commonConstants.saveSuccessMessage,
      type: commonConstants.responseType.success,
    };
    this.setState({
      notification: successNotification,
      formData: this._formResourceMapper(response), loading: false,
    });

    clearTimeout(this.timeoutID);
    this.timeoutID = setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  onPreview() {
    this.generateFormPreviewJson();
  }

  getFormJson() {
    if (this.formDetail) {
      return this.formDetail.getFormJson();
    }
    return null;
  }

  getFormEvents() {
    if (this.state.formData && this.state.formData.resources) {
      const resource = this.state.formData.resources[0];
      if (resource && resource.value) {
        const formDetail = JSON.parse(resource.value);
        return formDetail && formDetail.events && formDetail.events;
      }
    }
    return null;
  }
  getFormPrivileges() {
    if (this.state.formData && this.state.formData.formPrivileges) {
      const formPrivilege = this.state.formData.privileges[0];
      if (formPrivilege) {
        return JSON.parse(formPrivilege);
      }
    }
    return null;
  }
  setErrorMessage(error) {
    const errorNotification = {
      message: error.message,
      type: commonConstants.responseType.error,
    };
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

  hasEmptyBlocks(formJson) {
    const controls = formJson.controls;
    return controls.some((control) => {
      if (
        (control.type === 'section' || control.type === 'table') &&
        control.controls.length === 0
      ) {
        return true;
      } else if (control.controls && control.controls.length > 0) {
        return this.hasEmptyBlocks(control);
      }
      return false;
    });
  }

  _createTranslationReqObject(container, locale) {
    const { version, name, uuid } = this.state.formData;
    const referenceVersion = this.state.referenceVersion;
    const referenceFormUuid = this.state.referenceFormUuid;
    const translations = Object.assign({}, container, {
      formUuid: uuid,
      formName: name,
      version,
      locale,
      referenceVersion,
      referenceFormUuid,
    });
    return [translations];
  }

  closeFormModal() {
    this.setState({ showModal: false });
  }

  closePreview() {
    this.setState({ showPreview: false });
  }

  openFormModal() {
    this.setState({ showModal: true });
  }

  showPublishButton() {
    const isPublished = this.state.formData
      ? this.state.formData.published
      : false;
    const isEditable = this.state.formData
      ? this.state.formData.editable
      : false;
    const resourceData = FormHelper.getFormResourceControls(
      this.state.formData
    );
    if ((!isPublished || isEditable) && this.state.httpReceived) {
      return (
        <button
          className="publish-button"
          disabled={isPublished}
          onClick={this.onPublish}
        >
          Publish
        </button>
      );
    }
    return null;
  }

  showPreviewButton() {
    return (
      <button className="preview-button" onClick={this.onPreview}>
        Preview
      </button>
    );
  }

  showSaveButton() {
    const isEditable = this.state.formData
      ? this.state.formData.editable
      : false;
    const isPublished = this.state.formData
      ? this.state.formData.published
      : false;
    if ((!isPublished || isEditable) && this.state.httpReceived) {
      return (
        <button
          className="fr save-button btn--highlight"
          onClick={
            this.state.formData &&
            this.state.originalFormName !== this.state.formData.name
              ? this.cloneFormResource
              : this.onSave
          }
        >
          Save
        </button>
      );
    }
    return null;
  }

  showEditButton() {
    const isEditable = this.state.formData
      ? this.state.formData.editable
      : false;
    const isPublished = this.state.formData
      ? this.state.formData.published
      : false;
    if (isPublished && !isEditable) {
      return (
        <div className="info-view-mode-wrap">
          <div className="info-view-mode">
            <i className="fa fa-info-circle fl"></i>
            <span className="info-message">
              This Form is a Published version. For editing click on
            </span>
            <button
              className="fr edit-button"
              onClick={() => this.openFormModal()}
            >
              Edit
            </button>
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
    const editableFormData = Object.assign({}, this.state.formData, {
      editable: true,
    });
    this.props.dispatch(clearTranslations());
    this.setState({
      formData: editableFormData,
      referenceVersion: this.state.formData.version,
      referenceFormUuid: this.state.formData.uuid,
    });
  }

  generateFormPreviewJson() {
    try {
      const formJson = this.getFormJson();
      if (formJson) {
        formJson.version = this.state.formData.version;
        formJson.events = this.state.formEvents;
        this.setState({ formPreviewJson: formJson });
        this.setState({ showPreview: true });
      }
    } catch (e) {
      this.setErrorMessage(e.getException());
    }
  }

  showPreviewModal() {
    return (
      <Popup
        className="form-preview-popup"
        closeOnDocumentClick={false}
        onClose={() => this.closePreview()}
        open={this.state.showPreview}
        position="top center"
      >
        <FormPreviewModal
          close={() => this.closePreview()}
          formJson={this.state.formPreviewJson}
          setErrorMessage={this.setErrorMessage}
        />
      </Popup>
    );
  }

  _saveFormResource(formJson) {
    this.setState({ loading: true });
    httpInterceptor
      .post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then((response) => {
        const updatedUuid = response.form.uuid;
        this.context.router.history.push(`/form-builder/${updatedUuid}`);
        const successNotification = {
          message: commonConstants.saveSuccessMessage,
          type: commonConstants.responseType.success,
        };
        this.setState({
          notification: successNotification,
          formData: this._formResourceMapper(response),
          loading: false,
        });

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

  _saveTranslationsAndPublishForm(formUuid, translations) {
    this.setState({ loading: true });
    const formNameTranslations = {
      form: {
        name: this.state.originalFormName,
        uuid: this.props.match.params.formUuid,
      },
      value: '',
    };
    const translationsPromises = [saveTranslations(translations)];
    if (this.state.referenceFormUuid && this.state.formData.version !== '1') {
      translationsPromises.push(
        saveFormNameTranslations(
          formNameTranslations,
          this.state.referenceFormUuid
        )
      );
    }
    Promise.all(translationsPromises)
      .then(() => {
        httpInterceptor
          .post(new UrlHelper().bahmniFormPublishUrl(formUuid))
          .then((response) => {
            const successNotification = {
              message: commonConstants.publishSuccessMessage,
              type: commonConstants.responseType.success,
            };
            const publishedFormData = Object.assign({}, this.state.formData, {
              published: response.published,
              version: response.version,
            });
            this.setState({
              notification: successNotification,
              formData: publishedFormData,
              loading: false,
            });

            clearTimeout(this.timeoutID);
            this.timeoutID = setTimeout(() => {
              this.setState({ notification: {} });
            }, commonConstants.toastTimeout);
          });
      })
      .catch((error) => {
        this.setErrorMessage(error);
        this.setState({ loading: false });
      });
  }

  _formResourceMapper(responseObject) {
    const form = Object.assign({}, responseObject.form);
    const formResource = {
      name: form.name,
      id: responseObject.form.id,
      dataType: responseObject.dataType,
      value: responseObject.value,
      uuid: responseObject.uuid,
    };
    form.resources = [formResource];
    return form;
  }

  updateFormName(formName) {
    let currentFormName = formName;
    if (formHelper.validateFormName(formName)) {
      const existForms = this.state.formList.filter(
        (form) =>
          form.display === formName && this.state.originalFormName !== formName
      );
      if (existForms.length > 0) {
        this.setErrorMessage({ message: 'Form with same name already exists' });
        currentFormName = this.state.originalFormName;
      }
    } else {
      this.setErrorMessage({
        message: 'Leading or trailing spaces and ^/-. are not allowed',
      });
      currentFormName = this.state.originalFormName;
    }
    const newFormData = Object.assign({}, this.state.formData, {
      name: currentFormName,
    });
    this.setState({ formData: newFormData });
    return currentFormName;
  }

  updateFormEvents(events) {
    this.setState({ formEvents: events });
  }
  updateFormPrivileges(privileges) {
    this.setState({ formPrivileges: privileges });
  }

  showErrors(error) {
    if (error.response) {
      error.response.json().then((data) => {
        const message =
          get(data, 'error.globalErrors[0].message') || error.message;
        this.setErrorMessage({ message });
      });
    } else {
      this.setErrorMessage({ message: error.message });
    }
  }

  validateNameLength(value) {
    if (value.length === 50) {
      this.setErrorMessage({
        message: 'Form name shall not exceed 50 characters',
      });
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
        const newFormData = Object.assign({}, this.state.formData, {
          uuid: response.uuid,
          id: response.id,
          published: isPublished,
          version: newVersion,
          resources: [],
        });
        this.setState({
          formData: newFormData,
          originalFormName: newFormData.name,
        });
        this.onSave();
      })
      .catch((error) => this.showErrors(error));
  }
  handleUpdateFormControlEvents(formJson) {
    const obsControlEvents = FormHelper.getObsControlEvents(formJson);
    this.props.dispatch(formLoad(obsControlEvents));
  }

  render() {
    const defaultLocale =
      this.props.defaultLocale || localStorage.getItem('openmrsDefaultLocale');
    return (
      <div>
        <Spinner show={this.state.loading} />
        <NotificationContainer notification={this.state.notification} />
        <FormBuilderHeader />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs
                match={this.props.match}
                routes={this.props.routes}
              />
            </div>
            <div className="fr">
              {this.showSaveButton()}
              {this.showPublishButton()}
              {this.showPreviewButton()}
            </div>
          </div>
        </div>
        <div className="container-content-wrap">
          <div className="container-content">
            {this.showEditButton()}
            {this.showPreviewModal()}
            <FormDetail
              defaultLocale={defaultLocale}
              formControlEvents={this.props.formControlEvents}
              formData={this.state.formData}
              formDetails={this.props.formDetails}
              formPrivileges={this.state.formPrivileges}
              ref={(r) => {
                this.formDetail = r;
              }}
              resetProperty={(property) =>
                this.props.dispatch(setChangedProperty(property))
              }
              setError={this.setErrorMessage}
              updateFormControlEvents={this.handleUpdateFormControlEvents}
              updateFormEvents={(events) => this.updateFormEvents(events)}
              updateFormName={(formName) => this.updateFormName(formName)}
              validateNameLength={(formName) =>
                this.validateNameLength(formName)
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

FormDetailContainer.propTypes = {
  defaultLocale: PropTypes.string,
  dispatch: PropTypes.func,
  formControlEvents: PropTypes.array,
  formPrivileges: PropTypes.array,
  formDetails: PropTypes.shape({
    events: PropTypes.object,
  }),
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.object,
  }),
  routes: PropTypes.array,
  translations: PropTypes.object,
};

FormDetailContainer.contextTypes = {
  router: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    defaultLocale: state.formDetails && state.formDetails.defaultLocale,
    translations: state.translations,
    formDetails: state.formDetails,
    formControlEvents: state.controlDetails.allObsControlEvents,
    formPrivileges: state.formPrivileges,
  };
}

export default connect(mapStateToProps)(FormDetailContainer);
