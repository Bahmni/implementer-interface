import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';

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
    const topLevelComponents = map(designerComponentDescriptors, (componentDescriptor, type) => {
      if (this.isTopLevel(componentDescriptor)) {
        return this.getControlItem(type, componentDescriptor);
      }
      return undefined;
    });
    return filter(topLevelComponents, component => component !== undefined);
  }

  isTopLevel(componentDescriptor) {
    return get(componentDescriptor, 'designProperties.isTopLevelComponent');
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
