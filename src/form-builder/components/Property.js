import React, { Component, PropTypes } from 'react';

export class Property extends Component {
  updateProperty(e) {
    const { description: { name } } = this.props;
    this.props.onPropertyUpdate({ [name]: e.target.checked });
  }

  render() {
    const { name, defaultValue } = this.props.description;
    return (
      <div>
        <label>{name}</label>
        <input onClick={(e) => this.updateProperty(e)} type="checkbox" value={defaultValue} />
      </div>
    );
  }
}

Property.propTypes = {
  description: PropTypes.shape({
    dataType: PropTypes.string.isRequired,
    defaultValue: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
};

