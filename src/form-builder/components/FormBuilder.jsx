import React, { Component, PropTypes } from 'react';
import FormList from 'form-builder/components/FormList.jsx';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';
import { FormBuilderBreadcrumbs } from 'form-builder/components/FormBuilderBreadcrumbs.jsx';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import formHelper from '../helpers/formHelper';
import jsonpath from 'jsonpath/jsonpath';


export default class FormBuilder extends Component {

  constructor() {
    super();
    this.state = { showModal: false };
    this.setState = this.setState.bind(this);
    this.validationErrors = [];
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
    if (concept.units !== null) {
      return concept.name.replace(`(${concept.units})`, '');
    }

    return concept.name;
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
    let formJson = null;

    const formName = file[0].name.split('_')[0];
    const form = {
      name: formName,
      version: '1',
      published: false,
    };

    // eslint-disable-next-line
    reader.onload = function () {
      formJson = JSON.parse(reader.result);
      const value = JSON.parse(formJson.resources[0].value);

      if (formHelper.validateFormName(formName)) {
        self.fixuuid(value).catch(() => {
          self.props.onValidationError(self.validationErrors);
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
                      uuid: formUuid,
                    },
                    value: JSON.stringify(value),
                    uuid: data.resources[0].uuid,
                  };

                  self.props.saveFormResource(formResource);
                });
            });
        });
      }
    };

    reader.readAsText(file[0]);
  }

  fixuuid(value) {
    const checkPromises = [];
    this.validationErrors = [];
    const concepts = jsonpath.query(value, '$..concept');

    concepts.forEach((concept) => {
      const name = this.getConceptNameWithoutUnit(concept);
      const conceptCheckPromise = httpInterceptor
        .get(`${formBuilderConstants.conceptUrl}?q=${name}&source=byFullySpecifiedName`)
        .then((response) => {
          if (response.results.length >= 1) {
            // eslint-disable-next-line
            concept.uuid = response.results[0].uuid;
            return true;
            // eslint-disable-next-line
          } else {
            const msg = `Concept name not found ${name}`;
            this.validationErrors.push(msg);
            throw new Error(msg);
          }
        }
      );

      checkPromises.push(conceptCheckPromise);
    });

    const setMembers = jsonpath.query(value, '$..setMembers');
    setMembers.forEach((setMember) => {
      setMember.forEach((member) => {
        const name = this.getConceptNameWithoutUnit(member);
        const memberCheckPromise = httpInterceptor
          .get(`${formBuilderConstants.conceptUrl}?q=${name}&source=byFullySpecifiedName`)
          .then((response) => {
            if (response.results.length >= 1) {
              // eslint-disable-next-line
              member.uuid = response.results[0].uuid;
            } else {
              const msg = `Concept name not found ${name}`;
              this.validationErrors.push(msg);
              throw new Error(msg);
            }
          }
        );

        checkPromises.push(memberCheckPromise);
      });
    });

    return Promise.all(checkPromises);
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
            >Create a Form
            </button>
            <a className="importBtn fr">
              <input accept=".json" onChange={(e) => this.validateFile(e.target.files)}
                onClick={(e) => {
                       // eslint-disable-next-line
                       e.target.value = null;
                }} type="file"
              />Import</a>
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
  onValidationError: PropTypes.func,
  routes: PropTypes.array,
  saveForm: PropTypes.func.isRequired,
  saveFormResource: PropTypes.func,
};
