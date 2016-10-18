import React, { Component, PropTypes } from 'react';
import { Property } from 'form-builder/components/Property';

export class PropertyEditor extends Component {
  getProperties(attributes) {
    return attributes.map((attribute, index) =>
      <Property
        description={attribute}
        key={index}
        onPropertyUpdate={(property) => this.updateMetadataProperty(property)}
      />
    );
  }

  updateMetadataProperty(property) {
    const { metadata, metadata: { properties } } = this.props;
    const updatedProperties = Object.assign({}, properties, property);
    const updatedMetadata = Object.assign({}, metadata, { properties: updatedProperties });
    this.props.onPropertyUpdate(updatedMetadata);
  }

  render() {
    const { metadata: { type } } = this.props;
    const descriptor = window.componentStore.getDesignerComponent(type);
    const properties = descriptor.metadata.attributes.find((attr) => attr.name === 'properties');
    return <div>{this.getProperties(properties.attributes)}</div>;
  }
}

PropertyEditor.propTypes = {
  metadata: PropTypes.shape({
    type: PropTypes.string.isRequired,
    properties: PropTypes.object.isRequired,
  }).isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
};
