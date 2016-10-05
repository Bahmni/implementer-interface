import React, { Component, PropTypes } from 'react';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';

export class ControlPool extends Component {
  constructor() {
    super();
    this.draggableControls = this.getAllDesignerComponents();
  }

  onDragStart(context) {
    return (e) => e.dataTransfer.setData('data', JSON.stringify(context));
  }

  getControlItem(type, descriptor) {
    const { displayName } = descriptor.designProperties;
    const metadata = new Descriptor(type, descriptor).data().metadata;
    metadata.id = String(1 + Math.floor(Math.random() * 100));
    const context = { type, data: metadata };
    return (
      <div draggable="true"
        key={displayName}
        onDragStart={this.onDragStart(context)}
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
