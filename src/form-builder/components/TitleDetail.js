import React, { Component, PropTypes } from 'react';

export default class TitleDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { isEditable: false };
    this.input = props.value;
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.updateValue();
    }
  }

  updateValue() {
    this.props.updateValue(this.input);
    this.setState({ isEditable: false });
  }

  render() {
    if (this.state.isEditable) {
      return (
        <input
          autoFocus
          defaultValue={this.props.value}
          onBlur={() => this.updateValue()}
          onChange={(e) => (this.input = e.target.value)}
          onKeyUp={(e) => this.onKeyUp(e)}
          type="text"
          maxLength="50"
        />
      );
    }
    return (
      <label onDoubleClick={() => (this.setState({ isEditable: true }))}>
        {this.props.value}
      </label>
    );
  }
}

TitleDetail.propTypes = {
  updateValue: PropTypes.func,
  value: PropTypes.string.isRequired,
};

