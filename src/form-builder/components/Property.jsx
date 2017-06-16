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
        {this.props.elementType ?
          <button
            checked={value}
            className="control-event-button"
            onClick={() => this.updateProperty({ target: { checked: true } })}
          ><i aria-hidden="true" className="fa fa-code" /></button> :
          <input checked={value} className="fr"
            onChange={(e) => this.updateProperty(e)} type="checkbox"
          />
        }
      </div>
    );
  }
}

Property.propTypes = {
  elementName: PropTypes.string,
  elementType: PropTypes.string,
  name: PropTypes.string.isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};
