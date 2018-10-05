import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DescriptorParser as Descriptor } from 'form-builder/helpers/descriptorParser';
import map from 'lodash/map';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { ControlPoolElement } from 'form-builder/components/ControlPoolElement.jsx';
import { ComponentStore } from 'bahmni-form-controls';

export class ControlPool extends Component {
  constructor(props) {
    super(props);
    this.draggableControls = this.getAllDesignerComponents();
  }

  getControlItem(type, descriptor) {
    const { displayName } = descriptor.designProperties;
    const metadata = new Descriptor(type, descriptor).data().metadata;
    return (
      <ControlPoolElement
        displayName={displayName}
        idGenerator={ this.props.idGenerator }
        key={displayName}
        metadata={metadata}
      />);
  }


  getAllDesignerComponents() {
    const designerComponentDescriptors = ComponentStore.getAllDesignerComponents();
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
  idGenerator: PropTypes.object.isRequired,
};
