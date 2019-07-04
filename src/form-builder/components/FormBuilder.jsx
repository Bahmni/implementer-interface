import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
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


export default class FormBuilder extends Component {

  constructor() {
    super();
    this.state = { showModal: false, selectedForms: [], notification: {} };
    this.setState = this.setState.bind(this);
    this.validationErrors = [];
    this.handleSelectedForm = this.handleSelectedForm.bind(this);
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

  validateFile(file) {
    const self = this;
    const reader = new FileReader();
    let formData = null;

    // eslint-disable-next-line
    reader.onload = function () {
      try {
        formData = JSON.parse(reader.result);
        const { formJson, translations } = formData;
        const formName = formJson.name;
        const value = JSON.parse(formJson.resources[0].value);
        const form = {
          name: formName,
          version: '1',
          published: false,
        };

        if (formHelper.validateFormName(formName)) {
          self.fixuuid(value).catch(() => {
            const message = `Concept validation error: \n${self.validationErrors.join('\n')}`;
            self.props.onValidationError(message);
            return false;
          }).then((validationPassed) => {
            if (!validationPassed) return;

            httpInterceptor.post(formBuilderConstants.formUrl, form).then((response) => {
              value.uuid = response.uuid;
              const formResource = {
                form: {
                  name: formName,
                  uuid: response.uuid,
                },
                value: JSON.stringify(value),
                uuid: '',
              };
              self.props.saveFormResource(formResource, translations);
            })
              .catch(() => {
                const formUuid = self.getFormUuid(formName);
                value.uuid = formUuid;
                const params =
                  'v=custom:(id,uuid,name,version,published,auditInfo,' +
                  'resources:(value,dataType,uuid))';
                httpInterceptor
                  .get(`${formBuilderConstants.formUrl}/${formUuid}?${params}`)
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
          });
        }
      } catch (error) {
        self.props.onValidationError('Error Importing.. Please import a valid form');
      }
    };

    reader.readAsText(file[0]);
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
        this.validationErrors.push(msg);
        throw new Error(msg);
      }
      );

    checkPromises.push(conceptCheckPromise);
  }

  fixuuid(value) {
    const checkPromises = [];
    this.validationErrors = [];
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

    return Promise.all(checkPromises);
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
    httpInterceptor.get(`${formBuilderConstants.exportUrl}?uuids=${this.state.selectedForms}`)
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
              zip.generateAsync({ type: 'blob' }).then((content) => {
                saveAs(content, commonConstants.exportFileName);
              });
            }
          })
    .catch(() => {
      this.setMessage('Export failed', commonConstants.responseType.error);
    });
  }

  render() {
    return (
      <div>
        <FormBuilderHeader />
        <NotificationContainer notification={this.state.notification} />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs routes={this.props.routes} />
            </div>
            <button
              accessKey="n" className="btn--highlight openFormModal fr"
              onClick={() => this.openFormModal()}
            >Create a Form
            </button>
            <button className="importBtn">
              <label htmlFor="formImportBtn" >Import
              <input accept=".json" id="formImportBtn"
                onChange={(e) => this.validateFile(e.target.files)}
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
  onValidationError: PropTypes.func,
  routes: PropTypes.array,
  saveForm: PropTypes.func.isRequired,
  saveFormResource: PropTypes.func,
};
