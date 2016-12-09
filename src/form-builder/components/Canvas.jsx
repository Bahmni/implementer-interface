import React, { Component, PropTypes } from 'react';
import each from 'lodash/each';
import { connect } from 'react-redux';
import { deselectControl } from 'form-builder/actions/control';
import ControlWrapper from 'form-builder/components/ControlReduxWrapper.jsx';
import { GridDesigner as Grid } from 'bahmni-form-controls';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.components = {};
    this.clearSelectedControl = this.clearSelectedControl.bind(this);
    this.state = { descriptors: this.getComponentDescriptors(props.formResourceControls) };
    this.gridReference = this.gridReference.bind(this);
    this.gridRef = undefined;
  }

  getComponentDescriptors(formResourceControls) {
    const descriptors = [];
    each(formResourceControls, control => {
      const designerComponentDescriptor = window.componentStore.getDesignerComponent(control.type);
      if (designerComponentDescriptor) {
        const descriptorClone = Object.assign({}, designerComponentDescriptor);
        descriptorClone.metadata = control;
        descriptors.push(descriptorClone);
      }
    });
    return descriptors;
  }

  clearSelectedControl() {
    this.props.dispatch(deselectControl());
  }

  prepareJson() {
    const controls = this.gridRef.getControls();
    const formJson = {
      id: this.props.formUuid,
      uuid: this.props.formUuid,
      controls,
    };
    return formJson;
  }

  gridReference(ref) {
    if (ref) {
      this.gridRef = ref;
    }
  }

  render() {
    const { formResourceControls } = this.props;
    return (
      <div
        className="form-builder-canvas"
        onClick={this.clearSelectedControl}
      >
        <div className="canvas-placeholder">Drag & Drop controls to create a form</div>
        <Grid
          className="bahmni-grid"
          controls={ formResourceControls || [] }
          idGenerator={ this.props.idGenerator }
          ref={ this.gridReference }
          wrapper={ ControlWrapper }
        />
      </div>
    );
  }
}

Canvas.propTypes = {
  dispatch: PropTypes.func,
  formResourceControls: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
  idGenerator: PropTypes.object.isRequired,
};

export default connect(null, null, null, { withRef: true })(Canvas);
