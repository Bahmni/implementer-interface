import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Property extends Component {

  componentWillMount() {
    const { name, value } = this.props;
    setTimeout(() => {
      this.props.onPropertyUpdate({ [name]: value });
    }, 0);
  }

  getElement(elementType) {
    switch (elementType) {
      case 'button':
        return (<button
          checked={this.props.value}
          className="control-event-button"
          onClick={() => this.updateProperty({ target: { checked: true } })}
        ><i aria-hidden="true" className="fa fa-code" /></button>);
      case 'dropdown':
        return (
         <select
            className="fr property"
            defaultValue={this.props.value}
            key={`${this.props.name}:${this.props.id}`}
            onChange={(e) => this.updateProperty(e, elementType)}
          >
          {
            this.props.options.map((option, index) =>
              <option key={index} value={option}>{option}</option>
            )
          }
        </select>);
      case 'text':
        return (<input
          className="fr"
          defaultValue={this.props.value}
          key={`${this.props.name}:${this.props.id}`}
          {...(this.props.name === 'url'
              ? { onBlur: e => this.updateProperty(e, elementType) }
              : { onChange: e => this.updateProperty(e, elementType) })}
          type="text"
        />);
      case 'number':
        return (<input
          className="fr property"
          defaultValue={this.props.value}
          key={`${this.props.name}:${this.props.id}`}
          onChange={(e) => this.updateProperty(e, elementType)}
          type="number"
        />);
      default:
        return (<input
          checked={this.props.value}
          className="fr"
          onChange={(e) => this.updateProperty(e)}
          type="checkbox"
        />);
    }
  }

  updateProperty(e, elementType) {
    const { name } = this.props;
    if (elementType === 'text' || elementType === 'dropdown' || elementType === 'number') {
      this.props.onPropertyUpdate({ [name]: e.target.value });
    } else {
      this.props.onPropertyUpdate({ [name]: e.target.checked });
    }
  }

  render() {
    const { name, elementType } = this.props;
    return (
      <div>
        <label>{name}</label>
        {this.getElement(elementType)}
      </div>
    );
  }
}

Property.propTypes = {
  elementName: PropTypes.string,
  elementType: PropTypes.string,
  id: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  onPropertyUpdate: PropTypes.func.isRequired,
  options: PropTypes.array,
  value: PropTypes.any.isRequired,
};
