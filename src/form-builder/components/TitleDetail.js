import React, { Component, PropTypes } from 'react';

export default class TitleDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { isEditable: false };
    this.input = props.value;
  }

  updateValue(value) {
    this.props.updateValue(value);
    this.setState({ isEditable: false });
  }
  render() {
    if (this.state.isEditable) {
      return (
        <form onSubmit={() => this.updateValue(this.input)}>
          <input
            autoFocus
            defaultValue={this.props.value}
            onChange={(e) => (this.input = e.target.value)}
            onBlur={() => this.updateValue(this.input)}
            type="text"
          />
        </form>
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

