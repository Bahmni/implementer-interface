import React, { Component, PropTypes } from 'react';
import { Property } from 'form-builder/components/Property';
import get from 'lodash/get';

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
