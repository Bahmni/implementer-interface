import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import formHelper from '../helpers/formHelper';
import {commonConstants} from "../../common/constants";


export default class FormBuilder extends Component {

  constructor() {
    super();
    this.state = { showModal: false };
    this.setState = this.setState.bind(this);
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

  createExistedForm(formName, formResource) {
    const version = this.getFormVersion(formName).toString();
    const form = {
      name: formName,
      version: version,
      published: false,
    };
    // httpInterceptor
    //   .post(formBuilderConstants.formUrl, form)
    //   .then(() => {
    //     this.saveFormResource(formResource);
    //   });

    this.saveFormResource(formResource);
  }

  validateFile(file){
    const self = this;
    const reader = new FileReader();
    let formJson = null;

    const formName = file[0].name.split('_')[0];
    const form = {
      name: formName,
      version: '1',
      published: false,
    };

    reader.onload = function(){
      formJson = reader.result;
      const value = JSON.parse(formJson).resources[0].value;

      if (formHelper.validateFormName(formName)) {
        httpInterceptor
          .post(formBuilderConstants.formUrl, form)
          .then((response) => {
            let updatedValue = JSON.parse(value);
            updatedValue.uuid = response.uuid;
            const formResource = {
              form: {
                name: formName,
                uuid: updatedValue.uuid,
              },
              value: JSON.stringify(updatedValue),
              uuid: '',
            };
            self.saveFormResource(formResource);
          })
          .catch(() => {
            const formResource = {
              form: {
                name: formName,
                uuid: JSON.parse(value).uuid
              },
              value: value,
              uuid: JSON.parse(formJson).resources[0].uuid,
            };

            self.createExistedForm(formName, formResource)
        });
      }
    };

    reader.readAsText(file[0]);
  }

  getFormVersion(formName) {
    let version = 1;
    this.props.data.forEach(form => {
      if (form.name === formName) {
        const exitedFormMaxVersion = parseInt(form.version);
        version = exitedFormMaxVersion > version ? exitedFormMaxVersion : version;
      }
    });

    return version + 1;
  }

  saveFormResource(formJson) {
    httpInterceptor.post(formBuilderConstants.bahmniFormResourceUrl, formJson)
      .then(function (response) {
        console.log('222222222' + response);
      })
      .catch((error) => {
        console.log('111111111111111' + error);
      });
  }

  render() {
    return (
      <div>
        <FormBuilderHeader />
        <div className="breadcrumb-wrap">
          <div className="breadcrumb-inner">
            <div className="fl">
              <FormBuilderBreadcrumbs routes={this.props.routes} />
            </div>
            <button
              accessKey="n" className="btn--highlight fr"
              onClick={() => this.openFormModal()}
            >Create a Form</button>
            <a className="importBtn fr"><input type="file" accept=".json" onChange={(e) => this.validateFile(e.target.files)}/>Import</a>
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
              <FormList data={this.props.data} />
            </div>
          </div>
      </div>
      </div>
    );
  }
}

FormBuilder.propTypes = {
  data: PropTypes.array.isRequired,
  routes: PropTypes.array,
  saveForm: PropTypes.func.isRequired,
};
