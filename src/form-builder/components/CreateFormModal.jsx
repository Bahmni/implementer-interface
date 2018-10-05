import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import NotificationContainer from 'common/Notification';
import { commonConstants } from 'common/constants';

export default class CreateFormModal extends Component {

  constructor() {
    super();
    this.createForm = this.createForm.bind(this);
    this.state = { red: false, buttonDisable: false, notification: {} };
  }

  setFormName(formName) {
    this.formName = formName;
    this.validateName(formName);
  }

  setErrorMessage(errorMessage) {
    const errorNotification = { message: errorMessage, type: commonConstants.responseType.error };
    this.setState({ notification: errorNotification });

    setTimeout(() => {
      this.setState({ notification: {} });
    }, commonConstants.toastTimeout);
  }

  validateName(value) {
    if (value.length >= 50) {
      this.setState({ red: true, buttonDisable: true });
      this.setErrorMessage('Form name shall not exceed 50 characters');
    } else {
      this.setState({ red: false, buttonDisable: false });
    }
  }

  createForm(e) {
    e.preventDefault();
    this.props.createForm(this.formName.trim());
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }

  render() {
    if (this.props.showModal) {
      return (
                <div>
                    <NotificationContainer
                      notification={this.state.notification}
                    />
                    <div onKeyUp={(e) => this.handleEsc(e)}>
                        <div className="dialog-wrapper" onClick={this.props.closeModal}></div>
                        <div className="dialog">
                            <h2 className="header-title">Create a Form</h2>
                            <form className="dialog--container"
                              onSubmit={(e) => this.createForm(e)}
                            >
                                <div className="form-field clearfix">
                                    <label>Form Name <span className="asterisk">*</span></label>
                                    <input
                                      autoFocus
                                      className={ classNames('form-name',
                                            { 'is-red': this.state.red })}
                                      maxLength="50"
                                      onChange={(e) => this.setFormName(e.target.value)}
                                      pattern="[^\.\/\-\^\s][^\.\/\-\^]*"
                                      required
                                      title="Leading or trailing spaces and ^/-. are not allowed"
                                      type="text"
                                    />
                                </div>
                                <div className="button-wrapper fr">
                                    <input className="button btn--highlight"
                                      disabled={this.state.buttonDisable}
                                      type="submit"
                                      value="Create Form"
                                    />
                                    <button className="btn" onClick={this.props.closeModal}
                                      type="reset"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>);
    }
    return null;
  }
}

CreateFormModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
