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
      formJson = JSON.parse(reader.result);
      const value = JSON.parse(formJson.resources[0].value);

      if (formHelper.validateFormName(formName)) {
        httpInterceptor.post(formBuilderConstants.formUrl, form)
          .then((response) => {
            value.uuid = response.uuid;
            const formResource = {
              form: {
                name: formName,
                uuid: response.uuid,
              },
              value: JSON.stringify(value),
              uuid: '',
            };
            self.props.saveFormResource(formResource);
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
                      uuid: formUuid
                    },
                    value: JSON.stringify(value),
                    uuid: data.resources[0].uuid,
                  };
                  self.props.saveFormResource(formResource);
              }).catch((error) => {
                console.log(error);
            });
        });
      }
    };

    reader.readAsText(file[0]);
  }

  getFormUuid(formName){
    const version = this.getFormVersion(formName);
    let uuid = '';
    this.props.data.forEach(form => {
      if(form.name === formName && form.version === version){
        uuid = form.uuid;
      }
    });

    return uuid;
  }

  getFormVersion(formName) {
    let version = 1;
    this.props.data.forEach(form => {
      if (form.name === formName) {
        const exitedFormMaxVersion = parseInt(form.version);
        version = exitedFormMaxVersion > version ? exitedFormMaxVersion : version;
      }
    });

    return version;
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
  saveFormResource: PropTypes.func,
};
