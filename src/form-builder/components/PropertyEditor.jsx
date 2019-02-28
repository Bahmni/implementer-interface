import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Property } from 'form-builder/components/Property.jsx';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';
import remove from 'lodash/remove';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import { ComponentStore } from 'bahmni-form-controls';

export class PropertyEditor extends Component {
  /* eslint-disable no-param-reassign */
  getProperties(attributes) {
    const { metadata: { id, properties, unsupportedProperties } } = this.props;
    if (unsupportedProperties) {
      attributes = attributes.filter(attribute => !unsupportedProperties.includes(attribute.name));
    }
    const sortedAttributes = sortBy(attributes, (a) => a.elementName !== undefined);
    return sortedAttributes.map((attribute, index) => {
      const { name } = attribute;
      const value = get(properties, name, attribute.defaultValue);
      return (
        <Property
          id={id}
          key={index}
          name={name}
          onPropertyUpdate={(property) => this.props.onPropertyUpdate(property)}
          value={value}
          {...attribute}
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
    let allPropertyDescriptors;
    if (concept) {
      let { metadata: { concept: { datatype } } } = this.props;
      const { conceptHandler } = concept;
      datatype = concept.set ? 'obsGroupControl' : datatype;
      const descriptorsByType = this.getPropertyDescriptor(type);
      const descriptorsByConceptType = this.getPropertyDescriptor(datatype);
      const descriptorsByHandler = conceptHandler ?
        this.getPropertyDescriptor(conceptHandler) : [];
      allPropertyDescriptors =
        descriptorsByType.concat(descriptorsByConceptType).concat(descriptorsByHandler);
    } else {
      allPropertyDescriptors = this.getPropertyDescriptor(type);
    }
    const disabledDescriptors = allPropertyDescriptors.filter((d) => d.disabled);
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
    id: PropTypes.number.isReqyuired,
    properties: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
};
