import React, { Component, PropTypes } from 'react';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import Canvas from 'form-builder/components/Canvas.jsx';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import { formBuilderConstants } from 'form-builder/constants';
import filter from 'lodash/filter';
import get from 'lodash/get';


export default class FormDetail extends Component {
  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onPublish = this.onPublish.bind(this);
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
  }

  onSave() {
    try {
      const formJson = this.canvas.getWrappedInstance().prepareJson();
      const formName = this.props.formData ? this.props.formData.name : 'FormName';
      const formResourceUuid = this.props.formData && this.props.formData.resources.length > 0 ?
        this.props.formData.resources[0].uuid : '';
      const formResource = {
        form: {
          name: formName,
          uuid: this.props.formData.uuid,
        },
        valueReference: JSON.stringify(formJson),
        dataType: formBuilderConstants.formResourceDataType,
        uuid: formResourceUuid,
      };
      this.props.saveFormResource(formJson.uuid, formResource);
    } catch (e) {
      this.props.setError(e.getException());
    }
  }

  onPublish() {
    try {
      const formUuid = this.props.formData ? this.props.formData.uuid : undefined;
      this.props.publishForm(formUuid);
    } catch (e) {
      this.props.setError(e.getException());
    }
  }

  onEdit() {
    try {
      const confirmResult = confirm('Edit of the form will allow you to ' +
        'create a new version of form. Do you want to proceed?');
      if (confirmResult) {
        this.props.editForm();
      }
    } catch (e) {
      this.props.setError(e.getException());
    }
  }

  showSaveOrEditButton() {
    const isEditable = this.props.formData ? this.props.formData.editable : false;
    const isPublished = this.props.formData ? this.props.formData.published : false;
    if (isPublished && !isEditable) {
      return (<button className="fr edit-button" onClick={ this.onEdit }>Edit</button>);
    }
    return (<button className="fr save-button" onClick={ this.onSave }>Save</button>);
  }

  showPublishButton() {
    const isPublished = this.props.formData ? this.props.formData.published : false;
    if (!isPublished) {
      return (
        <button className="publish-button" onClick={ this.onPublish }>Publish</button>
      );
    }
    return null;
  }

  canvasRef(ref) {
    this.canvas = ref;
  }

  formTitle(name, version, published, editable) {
    const status = published && !editable ? 'Published' : 'Draft';
    return `${name} v${version} - ${status}`;
  }

  render() {
    const { formData } = this.props;
    if (formData) {
      const { name, uuid, id, resources, version, published, editable } = this.props.formData;
      const formResources = filter(resources,
        (resource) => resource.dataType === formBuilderConstants.formResourceDataType);
      const valueReferenceAsString = get(formResources, ['0', 'valueReference']);
      const formResourceControls =
        (valueReferenceAsString && JSON.parse(valueReferenceAsString).controls) || [];
      const idGenerator = new IDGenerator(formResourceControls);
      return (
        <div>
          <div className="button-wrapper">
            {this.showSaveOrEditButton()}
            {this.showPublishButton()}
          </div>
          <div className="container-main">
            <h2 className="header-title">{this.formTitle(name, version, published, editable)}</h2>
            <div className="container-columns">
              <div className="column-side">
                <ControlPool
                  formResourceControls={formResourceControls}
                  idGenerator={idGenerator}
                />
                <ControlPropertiesContainer />
              </div>
              <div className="container-column-main">
                <div className="column-main">
                  <Canvas
                    formId={id}
                    formName={name}
                    formResourceControls={formResourceControls}
                    formUuid={ uuid }
                    idGenerator={idGenerator}
                    ref={this.canvasRef}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
}

FormDetail.propTypes = {
  editForm: PropTypes.func,
  formData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    resources: PropTypes.array,
    uuid: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    editable: PropTypes.bool,
  }),
  publishForm: PropTypes.func.isRequired,
  saveFormResource: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
