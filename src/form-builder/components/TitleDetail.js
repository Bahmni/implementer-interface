import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotificationContainer from 'common/Notification';
import classNames from 'classnames';


export default class TitleDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { isEditable: false, red: false, notification: {} };
    this.input = props.value;
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.updateValue();
    }
  }

  setFormName(formName) {
    this.input = formName;
  }

  validateNameLength(value) {
    if (this.props.validateNameLength(value)) {
      this.setState({ red: true });
    } else {
      this.setState({ red: false });
    }
  }

  updateValue() {
    this.props.updateValue(this.input);
    this.setState({ isEditable: false });
  }

  render() {
    if (this.state.isEditable) {
      return (
                <div>
                    <NotificationContainer
                      notification={this.state.notification}
                    />
                    <input
                      className={ classNames({ 'is-red': this.state.red })}
                      defaultValue={this.props.value}
                      maxLength="50"
                      onBlur={() => this.updateValue()}
                      onChange={(e) => this.setFormName(e.target.value)}
                      onKeyPress={(e) => this.validateNameLength(e.target.value)}
                      onKeyUp={(e) => this.onKeyUp(e)}
                      type="text"
                    />
                </div>
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
  validateNameLength: PropTypes.func,
  value: PropTypes.string.isRequired,
};

