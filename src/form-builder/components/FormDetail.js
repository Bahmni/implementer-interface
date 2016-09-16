import React, { Component, PropTypes } from 'react';
import { ControlPool } from './ControlPool';
import Canvas from './Canvas';

export default class FormDetail extends Component {
  constructor() {
    super();
    this.onSave = this.onSave.bind(this);
    this.canvasRef = this.canvasRef.bind(this);
    this.canvas = undefined;
  }

  onSave() {
    const formJson = this.canvas.prepareJson();
    const formName = this.props.formData ? this.props.formData.name : 'FormName';
    const formResource = {
      name: formName,
      valueReference: JSON.stringify(formJson),
    };
    this.props.saveForm(formJson.uuid, formResource);
  }

  canvasRef(ref) {
    this.canvas = ref;
  }

  render() {
    const { formData } = this.props;
    if (formData) {
      return (
        <div>
          <button onClick={ this.onSave }>Save</button>
          <ControlPool />
          <Canvas formUuid={ formData.uuid } ref={ this.canvasRef } />
        </div>
      );
    }
    return null;
  }
}

FormDetail.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  }),
  saveForm: PropTypes.func,
};

export default FormDetail;
