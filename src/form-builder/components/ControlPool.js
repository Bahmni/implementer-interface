import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';

export class ControlPool extends Component {
  constructor() {
    super();
    this.draggableControls = this.getAllDesignerComponents();
  }

  onDragStart(type) {
    return (e) => e.dataTransfer.setData('data', type);
  }

  getControlItem(type, descriptor) {
    const { displayName } = descriptor.designProperties;
    return (
      <div draggable="true"
        key={displayName}
        onDragStart={this.onDragStart(type)}
      >
        {displayName}
      </div>);
  }

  getAllDesignerComponents() {
    const designerComponentDescriptors = window.componentStore.getAllDesignerComponents();
    return map(designerComponentDescriptors, (componentDescriptor, type) =>
      this.getControlItem(type, componentDescriptor)
    );
  }

  render() {
    return (
      <div>
        <div className="controls-title">Controls</div>
        <div className="controls-list">{this.draggableControls}</div>
      </div>
    );
  }
}

ControlPool.propTypes = {
  formData: PropTypes.object,
};
