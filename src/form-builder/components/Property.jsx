import React, { Component, PropTypes } from 'react';

export class Property extends Component {
  updateProperty(e) {
    const { name } = this.props;
    this.props.onPropertyUpdate({ [name]: e.target.checked });
  }

  render() {
    const { name, value } = this.props;
    return (
      <div>
        <label>{name}</label>
        <input checked={value} onChange={(e) => this.updateProperty(e)} type="checkbox" />
      </div>
    );
  }
}

Property.propTypes = {
  name: PropTypes.string.isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

