import React, { PropTypes } from 'react';
import { DraggableComponent } from './DraggableComponent';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import maxBy from 'lodash/maxBy';
import toNumber from 'lodash/toNumber';
import map from 'lodash/map';
import { connect } from 'react-redux';
import { selectControl } from 'form-builder/actions/control';

class Canvas extends DraggableComponent {
  constructor() {
    super();
    this.state = { descriptors: [] };
    this.components = {};
    this.storeComponentRef = this.storeComponentRef.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  postDragProcess(data) {
    const component = window.componentStore.getDesignerComponent(data);
    const descriptor = new Descriptor(data, component).data();
    const descriptorClone = Object.assign({}, descriptor);
    descriptorClone.metadata.id = this.createId();
    this.setState({ descriptors: this.state.descriptors.concat(descriptorClone) });
  }

  onSelect(id) {
    this.props.dispatch(selectControl(id));
  }

  createId() {
    const latestDescriptor = maxBy(this.state.descriptors, (d) => toNumber(d.metadata.id));
    return latestDescriptor ? (+latestDescriptor.metadata.id + 1).toString() : '1';
  }

  prepareJson() {
    const controls = map(this.components, (component) => component.getJsonDefinition()) || [];
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

  render() {
    return (
      <div id="form-builder-canvas" onDragOver={ this.onDragOver } onDrop={ this.onDrop }>
        <div className="canvas-placeholder">Drag & Drop controls to create a form</div>
        <div id="form-detail">{ this.renderComponents() }</div>
      </div>
    );
  }
}

Canvas.propTypes = {
  dispatch: PropTypes.func,
  formUuid: PropTypes.string.isRequired,
};

export default connect()(Canvas);
