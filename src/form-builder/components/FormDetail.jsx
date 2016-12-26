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
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
  }

  onSave() {
    try {
      const formJson = this.canvas.getWrappedInstance().prepareJson();
      const formName = this.props.formData ? this.props.formData.name : 'FormName';
      const formResource = {
        name: formName,
        valueReference: JSON.stringify(formJson),
        dataType: formBuilderConstants.formResourceDataType,
      };
      this.props.saveFormResource(formJson.uuid, formResource);
    } catch (e) {
      this.props.setError(e.getException());
    }
  }

  canvasRef(ref) {
    this.canvas = ref;
  }

  render() {
    const { formData } = this.props;
    if (formData) {
      const { name, uuid, id, resources, version } = this.props.formData;
      const formResources = filter(resources,
        (resource) => resource.dataType === formBuilderConstants.formResourceDataType);
      const valueReferenceAsString = get(formResources, ['0', 'valueReference']);
      const formResourceControls =
        (valueReferenceAsString && JSON.parse(valueReferenceAsString).controls) || [];
      const idGenerator = new IDGenerator(formResourceControls);
      return (
        <div>
          <div className="container-main">
            <h2 className="header-title">{name}</h2>
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
                    formVersion={version}
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
  formData: PropTypes.shape({
    version: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    resources: PropTypes.array,
    uuid: PropTypes.string.isRequired,
  }),
  saveFormResource: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
