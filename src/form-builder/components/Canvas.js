import React, { Component, PropTypes } from 'react';
import each from 'lodash/each';
import { connect } from 'react-redux';
import { addSourceMap, deselectControl } from 'form-builder/actions/control';
import { getConceptFromControls } from 'form-builder/helpers/componentMapper';
import ControlWrapper from 'form-builder/components/ControlReduxWrapper.js';
import { GridDesigner as Grid } from 'bahmni-form-controls';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.components = {};
    this.clearSelectedControl = this.clearSelectedControl.bind(this);

    const initialComponentDescriptors = this.getComponentDescriptors();
    const initialConceptToControlMap = getConceptFromControls(initialComponentDescriptors);
    this.state = { descriptors: initialComponentDescriptors };
    props.dispatch(addSourceMap(initialConceptToControlMap));
    this.gridReference = this.gridReference.bind(this);
    this.gridRef = undefined;
  }

  getComponentDescriptors() {
    const descriptors = [];
    each(this.props.formResourceControls, control => {
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
};

export default connect(null, null, null, { withRef: true })(Canvas);
