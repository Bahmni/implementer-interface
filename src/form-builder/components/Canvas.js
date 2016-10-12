import React, { PropTypes } from 'react';
import { DraggableComponent } from './DraggableComponent';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import maxBy from 'lodash/maxBy';
import toNumber from 'lodash/toNumber';
import each from 'lodash/each';
import { connect } from 'react-redux';
import { addSourceMap, deselectControl, selectControl } from 'form-builder/actions/control';
import { getConceptFromControls, setConceptToControls } from 'form-builder/helpers/componentMapper';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import ControlWrapper from 'form-builder/components/ControlReduxWrapper.js';

class Canvas extends DraggableComponent {
  constructor(props) {
    super(props);
    this.components = {};
    this.storeComponentRef = this.storeComponentRef.bind(this);
    this.clearSelectedControl = this.clearSelectedControl.bind(this);
    this.onSelect = this.onSelect.bind(this);

    const initialComponentDescriptors = this.getComponentDescriptors();
    const initialConceptToControlMap = getConceptFromControls(initialComponentDescriptors);
    const gridDescriptor = window.componentStore.getDesignerComponent('grid');

    this.state = { descriptors: initialComponentDescriptors };
    props.dispatch(addSourceMap(initialConceptToControlMap));
    this.grid = gridDescriptor ? gridDescriptor.control : () => (<div />);
    this.gridReference = this.gridReference.bind(this);
    this.gridRef = undefined;
    window.bahmniIDGenerator = new IDGenerator();
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

  componentWillReceiveProps(nextProps) {
    const currentDescriptors = this.state.descriptors;
    const conceptToControlMap = nextProps.conceptToControlMap;
    const descriptorsWithConcepts = setConceptToControls(currentDescriptors, conceptToControlMap);
    this.setState({ descriptors: descriptorsWithConcepts });
  }

  postDragProcess(data) {
    const type = JSON.parse(data).type;
    const component = window.componentStore.getDesignerComponent(type);
    const descriptor = new Descriptor(type, component).data();
    const descriptorClone = Object.assign({}, descriptor);
    descriptorClone.metadata.id = this.createId();
    this.setState({ descriptors: this.state.descriptors.concat(descriptorClone) });
  }

  onSelect(event, id) {
    this.props.dispatch(selectControl(id));
    event.stopPropagation();
  }

  clearSelectedControl() {
    this.props.dispatch(deselectControl());
  }

  createId() {
    const latestDescriptor = maxBy(this.state.descriptors, (d) => toNumber(d.metadata.id));
    return latestDescriptor ? (+latestDescriptor.metadata.id + 1).toString() : '1';
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

  storeComponentRef(ref) {
    if (ref) {
      this.components[ref.props.metadata.id] = ref;
    }
  }

  renderComponents() {
    return this.state.descriptors.map(descriptor =>
      React.createElement(descriptor.control, {
        key: descriptor.metadata.id,
        metadata: descriptor.metadata,
        ref: this.storeComponentRef,
        onSelect: this.onSelect,
      })
    );
  }

  gridReference(ref) {
    if (ref) {
      this.gridRef = ref;
    }
  }

  render() {
    return (
      <div
        className="form-builder-canvas"
        onClick={this.clearSelectedControl}
        onDragOver={ this.onDragOver }
        onDrop={ this.onDrop }
      >
        <div className="canvas-placeholder">Drag & Drop controls to create a form</div>
        <this.grid className="bahmni-grid" ref={ this.gridReference }>
          <ControlWrapper />
        </this.grid>
      </div>
    );
  }
}

Canvas.propTypes = {
  conceptToControlMap: PropTypes.object,
  dispatch: PropTypes.func,
  formResourceControls: PropTypes.array.isRequired,
  formUuid: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return { conceptToControlMap: state.conceptToControlMap };
}

export default connect(mapStateToProps, null, null, { withRef: true })(Canvas);
