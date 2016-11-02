import React, { Component, PropTypes } from 'react';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { IDGenerator } from 'form-builder/helpers/idGenerator';
import { ControlPoolElement } from 'form-builder/components/ControlPoolElement.jsx';

export class ControlPool extends Component {
  constructor(props) {
    super(props);
    this.idGenerator = new IDGenerator(props.formResourceControls);
    this.draggableControls = this.getAllDesignerComponents();
  }

  getControlItem(type, descriptor) {
    const { displayName } = descriptor.designProperties;
    const metadata = new Descriptor(type, descriptor).data().metadata;
    return (
      <ControlPoolElement
        displayName={displayName}
        idGenerator={ this.idGenerator }
        key={displayName}
        metadata={metadata}
      />);
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
      <div className="section-grid">
        <h2 className="header-title">Controls</h2>
        <div className="section-content">{this.draggableControls}</div>
      </div>
    );
  }
}

ControlPool.propTypes = {
  formResourceControls: PropTypes.array.isRequired,
};
