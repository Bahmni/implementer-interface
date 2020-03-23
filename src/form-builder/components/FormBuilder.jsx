import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import FormBuilderBreadcrumbs from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import formHelper from '../helpers/formHelper';
import jsonpath from 'jsonpath/jsonpath';
import find from 'lodash/find';
import { commonConstants } from '../../common/constants';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import NotificationContainer from 'common/Notification';
import { remove } from 'lodash';
import Spinner from 'common/Spinner';
import { formEventUpdate, saveEventUpdate } from 'form-builder/actions/control';

export default class FormBuilder extends Component {

  constructor(props) {
    super(props);
    this.state = { showModal: false, selectedForms: [], notification: {}, loading: false };
    this.setState = this.setState.bind(this);

    this.jsonFormat = 'application/json';
    this.zipFormats = 'application/zip,application/octet-stream,' +
      'application/x-zip,application/x-zip-compressed';
    this.importErrors = [];
    this.formJSONs = [];
    this.formConceptValidationResults = {};
    this.handleSelectedForm = this.handleSelectedForm.bind(this);
    this.parseErrorMessage = 'Parse Error While Importing.. Please import a valid form';
    this.clearEventEditors();
  }

  getFormVersion(formName) {
    let version = 1;
    this.props.data.forEach(form => {
      if (form.name === formName) {
        // eslint-disable-next-line
        const exitedFormMaxVersion = parseInt(form.version);
        version = exitedFormMaxVersion > version ? exitedFormMaxVersion : version;
      }
    });

    return version;
  }

  getFormUuid(formName) {
    const version = this.getFormVersion(formName);
    let uuid = '';
    this.props.data.forEach(form => {
      if (form.name === formName && form.version === version) {
        uuid = form.uuid;
      }
    });

    return uuid;
  }

  getConceptNameWithoutUnit(concept) {
    const conceptName = concept.name.name || concept.name;
    if (concept.units) {
      return conceptName.replace(`(${concept.units})`, '');
    }

    return conceptName;
  }

  setMessage(messageText, type) {
    const notification = { message: messageText, type };
    this.setState({ notification });
    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  getValidJsonFileNames(fileNames) {
    const validJsonFiles = [];
    fileNames.forEach(fileName => {
      if (fileName.endsWith('.json')) {
        validJsonFiles.push(fileName);
      } else {
        this.updateImportErrors(fileName, 'Invalid file format');
      }
    });
    return validJsonFiles;
  }

  clearEventEditors() {
    this.props.dispatch(saveEventUpdate(''));
    this.props.dispatch(formEventUpdate(''));
  }

  validateAndLoadZipFile(jsonZip) {
    const self = this;
    const maxAllowedSize = 5 * 1024 * 1024;
    if (jsonZip.size > maxAllowedSize) {
      self.hideLoader();
      self.props.onValidationError('Error Importing.. Exceeded max file size 5MB');
    } else {
      const jsZip = new JSZip();
      jsZip.loadAsync(jsonZip).then((zip) => {
        self.validateFilesInZip(zip);
      });
    }
  }

  import(file) {
    this.resetValues();
    this.showLoader();
    if (file[0].type === this.jsonFormat) {
      this.importJsonFile(file);
    } else if (this.zipFormats.indexOf(file[0].type) !== -1) {
      this.validateAndLoadZipFile(file[0]);
    } else {
      this.props.onValidationError('Error Importing.. Please import a valid file format');
      this.hideLoader();
    }
  }

  updateImportErrors(fileName, errorMessage) {
    this.importErrors.push({
      name: fileName,
      error: errorMessage,
    });
  }

  resetValues() {
    this.importErrors = [];
    this.formJSONs = [];
    this.formConceptValidationResults = {};
  }

  hideLoader() {
    this.setState({ loading: false });
  }

  showLoader() {
    this.setState({ loading: true });
  }

  openFormModal() {
    this.setState({ showModal: true });
  }

  closeFormModal() {
    this.setState({ showModal: false });
  }

  createForm(formName) {
    const form = {
      name: formName,
      version: '1',
      published: false,
    };
    this.props.saveForm(form);
  }

  validateFilesInZip(jsonZip) {
    const self = this;
    const files = jsonZip.files;
    const fileNames = (files || files.length < 1) && Object.keys(files);
    if (fileNames.length < 1) {
      self.props.onValidationError('Error Importing.. No files found in ZIP');
      self.hideLoader();
      return;
    }
    const validJsonFileNames = self.getValidJsonFileNames(fileNames);
    const fileParsePromises = [];
    const formJsons = [];
    validJsonFileNames.forEach(fileName => {
      fileParsePromises.push(jsonZip.file(fileName).async('text').then(data => {
        try {
          formJsons.push({ fileName, formData: JSON.parse(data) });
        } catch (error) {
          self.updateImportErrors(fileName, self.parseErrorMessage);
        }
      }));
    });
    Promise.all(fileParsePromises).then(() => self.processForms(formJsons));
  }

  processForms(formJsons) {
    const formsValidationPromises = [];
    const self = this;
    formJsons.forEach(form => {
      try {
        const validateFormJson = self.validateFormJsonAndConcepts(form.fileName, form.formData);
        if (validateFormJson !== null) {
          formsValidationPromises.push(validateFormJson);
        }
      } catch (e) {
        this.updateImportErrors(form.fileName,
          'Parse Error While Importing.. Please import a valid form');
      }
    });
    self.processFormValidationPromises(formsValidationPromises);
  }

  importJsonFile(file) {
    const self = this;
    const reader = new FileReader();
    const fileName = file[0].name;
    // eslint-disable-next-line
    reader.onload = function () {
      try {
        const formData = JSON.parse(reader.result);
        const formsValidationPromises = [];
        const validateFormJsonPromise = self.validateFormJsonAndConcepts(fileName, formData);
        if (validateFormJsonPromise !== null) {
          formsValidationPromises.push(validateFormJsonPromise);
        }
        self.processFormValidationPromises(formsValidationPromises);
      } catch (error) {
        self.updateImportErrors(fileName, self.parseErrorMessage);
        self.downloadErrorsFile(self.importErrors);
      }
    };
    reader.readAsText(file[0]);
  }

  validateFormJsonAndConcepts(fileName, formData) {
    const self = this;
    const { formJson, translations } = formData;
    const formName = formJson.name;
    const value = JSON.parse(formJson.resources[0].value);
    const form = {
      name: formName,
      version: '1',
      published: false,
    };
    if (!formHelper.validateFormName(formName)) {
      self.updateImportErrors(fileName, 'Invalid File Name');
    } else {
      const conceptValidationPromise = self.fixuuid(value, fileName);
      return conceptValidationPromise.then(() => {
        if (self.formConceptValidationResults[fileName]) {
          const validationResults = self.formConceptValidationResults[fileName];
          let message = 'Concept validation error: \n';
          validationResults.forEach(v => {
            message = message.concat(`${v}\n`);
          });
          self.updateImportErrors(fileName, message);
        } else {
          self.formJSONs.push({ form, value, formName, translations });
        }
      });
    }
    return null;
  }

  processFormValidationPromises(formsValidationPromises) {
    const self = this;
    Promise.all(formsValidationPromises).then(() => {
      if (self.importErrors.length !== 0) {
        self.downloadErrorsFile(self.importErrors);
      }
      if (self.formJSONs.length !== 0) {
        self.importValidForms(self.formJSONs);
      }
    });
  }

  downloadErrorsFile(errors) {
    const filename = 'importErrors.txt';
    const blob = new Blob([JSON.stringify(errors)], {
      type: 'text/plain',
    });
    saveAs(blob, filename);
    this.hideLoader();
  }

  importValidForms(formJsons) {
    const self = this;
    const importFormJsonPromises = [];
    formJsons.forEach(formJson => {
      const { form, value, formName, translations } = formJson;
      importFormJsonPromises.push(self.saveFormJson(form, value, formName, translations));
    });
    Promise.all(importFormJsonPromises)
      .then(() => self.hideLoader())
      .catch(() => self.hideLoader());
  }

  saveFormJson(form, value, formName, translations) {
    const self = this;
    const val = value;
    return httpInterceptor.post(formBuilderConstants.formUrl, form).then((response) => {
      val.uuid = response.uuid;
      const formResource = {
        form: {
          name: formName,
          uuid: response.uuid,
        },
        value: JSON.stringify(value),
        uuid: '',
      };
      const translationsWithFormUuid = translations.map((eachTranslation) => Object.assign({},
        eachTranslation, { formUuid: response.uuid }));
      self.props.saveFormResource(formResource, translationsWithFormUuid);
    })
      .catch(() => {
        const formUuid = self.getFormUuid(formName);
        val.uuid = formUuid;
        const params =
        'v=custom:(id,uuid,name,version,published,auditInfo,' +
        'resources:(value,dataType,uuid))';
        httpInterceptor.get(`${formBuilderConstants.formUrl}/${formUuid}?${params}`)
        .then((data) => {
          const formResource = {
            form: {
              name: formName,
              uuid: formUuid,
            },
            value: JSON.stringify(value),
            uuid: data.resources[0].uuid,
          };
          self.props.saveFormResource(formResource, translations);
        });
      });
  }

  validateConcept(concept, checkPromises) {
    const name = this.getConceptNameWithoutUnit(concept);
    const params = `?q=${name}&source=byFullySpecifiedName&v=custom:(uuid,name:(name))`;
    const conceptCheckPromise = httpInterceptor
      .get(`${formBuilderConstants.conceptUrl}${params}`)
      .then((response) => {
        const result = find(response.results,
            (res) => res.name && res.name.name === name);
        if (result) {
            // eslint-disable-next-line
            concept.uuid = result.uuid;
          return true;
        }
        const msg = `Concept name not found ${name}`;
        throw new Error(msg);
      }
      );

    checkPromises.push(conceptCheckPromise);
  }

  fixuuid(value, fileName) {
    const checkPromises = [];
    const concepts = jsonpath.query(value, '$..concept');
    const setMembers = jsonpath.query(value, '$..setMembers');
    const conceptAnswers = jsonpath.query(value, '$..answers');

    concepts.forEach((concept) => {
      this.validateConcept(concept, checkPromises);
    });

    setMembers.forEach((setMember) => {
      setMember.forEach((member) => {
        this.validateConcept(member, checkPromises);
      });
    });

    conceptAnswers.forEach((answers) => {
      answers.forEach((answer) => {
        this.validateConcept(answer, checkPromises);
      });
    });

    const self = this;
    return Promise.all(checkPromises.map(promise => promise
      .catch(e => {
        if (self.formConceptValidationResults[fileName] !== undefined) {
          self.formConceptValidationResults[fileName].push(e.message);
        } else {
          self.formConceptValidationResults[fileName] = [e.message];
        }
      })
    ));
  }

  validateExport(formUuids) {
    if (formUuids.length === 0) {
      return true;
    }
    if (formUuids.length > commonConstants.exportNoOfFormsLimit) {
      this.setMessage(commonConstants.exportFormsLimit, commonConstants.responseType.error);
      return true;
    }
    return false;
  }

  handleSelectedForm(form) {
    if (!this.state.selectedForms.includes(form.uuid)) {
      this.state.selectedForms.push(form.uuid);
    } else remove(this.state.selectedForms, (item) => item === form.uuid);
  }

  exportForms() {
    if (this.validateExport(this.state.selectedForms)) {
      return;
    }
    const zip = new JSZip();
    let fileName;
    let params = '';
    const uuids = this.state.selectedForms;
    uuids.forEach((uuid, index) => {
      params = index !== 0 ? `${params}&uuid=${uuid}` : `uuid=${uuid}`;
    });
    httpInterceptor.get(`${formBuilderConstants.exportUrl}?${params}`)
          .then((exportResponse) => {
            if (exportResponse.errorFormList.length > 0) {
              this.setMessage(`Export Failed for ${exportResponse.errorFormList.toString()} . 
                Please verify ${commonConstants.logPath} for details`,
                  commonConstants.responseType.error);
            }
            const formData = exportResponse.bahmniFormDataList;
            formData.forEach(form => {
              fileName = `${form.formJson.name}_${form.formJson.version}`;
              zip.file(`${fileName}.json`, JSON.stringify(form));
            });
            if (formData.length > 0) {
              zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((content) => {
                saveAs(content, commonConstants.exportFileName);
              });
              if (exportResponse.errorFormList.length === 0) {
                this.setMessage(commonConstants.exportFormsSuccessMessage,
                  commonConstants.responseType.success);
              }
            }
          })
    .catch(() => {
      this.setMessage('Export failed', commonConstants.responseType.error);
    });
  }

  render() {
    return (
      <div>
        <Spinner show={this.state.loading} />
        <FormBuilderHeader />
        <NotificationContainer notification={this.state.notification} />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs match={this.props.match} routes={this.props.routes} />
            </div>
            <button
              accessKey="n" className="btn--highlight openFormModal fr"
              onClick={() => this.openFormModal()}
            >Create a Form
            </button>
            <button className="importBtn">
              <label htmlFor="formImportBtn">Import
                <input
                  accept={this.jsonFormat + this.zipFormats}
                  id="formImportBtn"
                  onChange={(e) => this.import(e.target.files)}
                  onClick={(e) => {
                         // eslint-disable-next-line
                         e.target.value = null;
                  }} type="file"
                /></label></button>
            <button className="exportBtn" onClick={() => this.exportForms()}>
              Export
            </button>
          </div>
        </div>
        <CreateFormModal
          closeModal={() => this.closeFormModal()}
          createForm={(formName) => this.createForm(formName)}
          showModal={this.state.showModal}
        />
        <div className="container-content-wrap">
          <div className="container-content">
            <div className="container-main form-list">
              <h2 className="header-title">Observation Forms</h2>
              <FormList data={this.props.data} handleSelectedForm={this.handleSelectedForm} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

FormBuilder.propTypes = {
  data: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    isExact: PropTypes.bool.isRequired,
    params: PropTypes.object,
  }),
  onValidationError: PropTypes.func,
  routes: PropTypes.array,
  saveForm: PropTypes.func.isRequired,
  saveFormResource: PropTypes.func,
};
