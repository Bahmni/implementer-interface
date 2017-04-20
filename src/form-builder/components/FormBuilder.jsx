import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import formHelper from '../helpers/formHelper';


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
    var reader = new FileReader();
    const fileJson = reader.readAsDataURL(file[0]);
    const formName = file[0].name.split('_')[0];
    const form = {
      name: formName,
      version: '1',
      published: true,
    };

    if (formHelper.validateFormName(formName)) {
      httpInterceptor
        .post(formBuilderConstants.formUrl, form)
        .then((response) => {
          const uuid = response.uuid;
          this.context.router.push(`/form-builder/${uuid}`);
        })
        .catch(() => this.createExistedForm(formName));
    }
  }

  createExistedForm(formName) {
    const version = this.getFormVersion(formName).toString();
    const form = {
      name: formName,
      version: version,
      published: true,
    };
    this.props.saveForm(form);
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
