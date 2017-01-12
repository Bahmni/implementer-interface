import React, { Component, PropTypes } from 'react';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import Canvas from 'form-builder/components/Canvas.jsx';
import classNames from 'classnames';
import ControlPropertiesContainer from 'form-builder/components/ControlPropertiesContainer.jsx';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import { formBuilderConstants } from 'form-builder/constants';
import filter from 'lodash/filter';
import get from 'lodash/get';

export default class FormDetail extends Component {
  constructor() {
    super();
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
  }

  getFormJson() {
    if (this.canvas) {
      return this.canvas.getWrappedInstance().prepareJson();
    }
    return null;
  }

  canvasRef(ref) {
    this.canvas = ref;
  }

  formTitle(name, version, published, editable) {
    const status = published && !editable ? 'Published' : 'Draft';
    const versionNumber = version ? `v${version}` : '';
    return `${name} ${versionNumber} - ${status}`;
  }

  render() {
    const { formData } = this.props;
    if (formData) {
      const { name, uuid, id, resources, version, published, editable } = this.props.formData;
      const formResources = filter(resources,
        (resource) => resource.dataType === formBuilderConstants.formResourceDataType);
      const valueReferenceAsString = get(formResources, ['0', 'value']);
      const formResourceControls =
        (valueReferenceAsString && JSON.parse(valueReferenceAsString).controls) || [];
      const idGenerator = new IDGenerator(formResourceControls);
      return (
        <div>
          <div className="button-wrapper">
          </div>
          <div className={ classNames('container-main', { published: (published && !editable) }) }>
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
  formData: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    resources: PropTypes.array,
    uuid: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    editable: PropTypes.bool,
  }),
  setError: PropTypes.func.isRequired,
};
