import React, { Component, PropTypes } from 'react';

export class Property extends Component {

  componentWillMount() {
    const { name, value } = this.props;
    this.props.onPropertyUpdate({ [name]: value });
  }

  updateProperty(e) {
    const { name } = this.props;
    this.props.onPropertyUpdate({ [name]: e.target.checked });
  }

  render() {
    const { name, value } = this.props;

    return (
      <div>
        <label>{name}</label>
        {this.props.type ?
          <input type={this.props.type} value={value} /> :
          <input checked={value} className="fr"
            onChange={(e) => this.updateProperty(e)} type="checkbox"
          />
        }
      </div>
    );
  }
}

Property.propTypes = {
  name: PropTypes.string.isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
  type: PropTypes.string,
};
