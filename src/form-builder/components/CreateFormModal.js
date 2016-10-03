import React, { Component, PropTypes } from 'react';

export default class CreateFormModal extends Component {

  constructor() {
    super();
    this.createForm = this.createForm.bind(this);
  }

  setFormName(formName) {
    this.formName = formName;
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }

  createForm(e) {
    e.preventDefault();
    this.props.createForm(this.formName);
  }

  render() {
    if (this.props.showModal) {
      return (
        <div onKeyUp={(e) => this.handleEsc(e)}>
          <div className="dialog-wrapper" onClick={this.props.closeModal}></div>
          <div className="dialog">
            <div className="dialog--header">Create a Form</div>
            <form className="dialog--container" onSubmit={(e) => this.createForm(e)}>
              <div className="form-field clearfix">
                <label>Form Name <span className="asterisk">*</span></label>
                <input
                  autoFocus
                  className="form-name"
                  onChange={(e) => this.setFormName(e.target.value)}
                  pattern="\S(.*\S)?"
                  required
                  title="Leading or trailing spaces are not allowed"
                  type="text"
                />
              </div>
              <div className="button-wrapper fr">
                <input className="btn--highlight" type="submit" value="Create Form" />
                <button className="btn" onClick={this.props.closeModal} type="reset">
                  Cancel
                </button>
              </div>
            </form>
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
