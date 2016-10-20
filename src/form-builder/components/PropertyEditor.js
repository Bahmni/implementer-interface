import React, { Component, PropTypes } from 'react';
import { Property } from 'form-builder/components/Property';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

export class PropertyEditor extends Component {
  getProperties(attributes) {
    const { metadata: { properties } } = this.props;
    return attributes.map((attribute, index) => {
      const { name } = attribute;
      const value = get(properties, name, attribute.defaultValue);
      return (
        <Property
          key={index}
          name={name}
          onPropertyUpdate={(property) => this.props.onPropertyUpdate(property)}
          value={value}
        />
      );
    });
  }

  getPropertyDescriptor(type) {
    const descriptor = window.componentStore.getDesignerComponent(type);
    const properties = descriptor.metadata.attributes.find((attr) => attr.name === 'properties');
    return get(properties, 'attributes', []);
  }

  getAllPropertyDescriptors() {
    const { metadata: { type, concept: { datatype } } } = this.props;
    const descriptorsByType = this.getPropertyDescriptor(type);
    const descriptorsByConceptType = this.getPropertyDescriptor(datatype);
    const allPropertyDescriptors = descriptorsByType.concat(descriptorsByConceptType);
    return uniqBy(allPropertyDescriptors, 'name');
  }

  render() {
    const allPropertyDescriptors = this.getAllPropertyDescriptors();
    return <div>{this.getProperties(allPropertyDescriptors)}</div>;
  }
}

PropertyEditor.propTypes = {
  metadata: PropTypes.shape({
    concept: PropTypes.shape({
      datatype: PropTypes.string.isRequired,
    }).isRequired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
};
