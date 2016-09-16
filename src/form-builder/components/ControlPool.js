import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
import filter from 'lodash/filter';
import map from 'lodash/map';

export class ControlPool extends Component {
  constructor() {
    super();
    this.draggableControls = this.getAllRegisteredComponent();
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

  getAllRegisteredComponent() {
    const registeredComponents = window.componentStore.getAllRegisteredComponents();
    const topLevelComponents = map(registeredComponents, (componentDescriptor, type) => {
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
