import React, { Component, PropTypes } from 'react';
import { Property } from 'form-builder/components/Property.jsx';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import { ComponentStore } from 'bahmni-form-controls';

export class PropertyEditor extends Component {
  getProperties(attributes) {
    const { metadata: { properties } } = this.props;
    const sortedAttributes = sortBy(attributes, (a) => a.elementName !== undefined);
    return sortedAttributes.map((attribute, index) => {
      const { name } = attribute;
      const value = get(properties, name, attribute.defaultValue);
      return (
        <Property
          key={index}
          name={name}
          onPropertyUpdate={(property) => this.props.onPropertyUpdate(property)}
          value={value}
          { ...attribute }
        />
      );
    });
  }

  getPropertyDescriptor(type) {
    const descriptor = ComponentStore.getDesignerComponent(type);
    const properties = descriptor.metadata.attributes.find((attr) => attr.name === 'properties');
    return get(properties, 'attributes', []);
  }

  getAllPropertyDescriptors() {
    const { metadata: { type, concept } } = this.props;
    let { metadata: { concept: { datatype } } } = this.props;
    datatype = concept.set ? 'obsGroupControl' : datatype;
    const descriptorsByType = this.getPropertyDescriptor(type);
    const descriptorsByConceptType = this.getPropertyDescriptor(datatype);
    const disabledDescriptors = descriptorsByConceptType.filter((d) => d.disabled);
    const allPropertyDescriptors = descriptorsByType.concat(descriptorsByConceptType);
    remove(allPropertyDescriptors, (propertyDescriptor) =>
      find(disabledDescriptors, (disabledDescriptor) =>
      disabledDescriptor.name === propertyDescriptor.name));
    return uniqBy(allPropertyDescriptors, 'name');
  }

  render() {
    const allPropertyDescriptors = this.getAllPropertyDescriptors();
    return <div className="form-properties">{this.getProperties(allPropertyDescriptors)}</div>;
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
