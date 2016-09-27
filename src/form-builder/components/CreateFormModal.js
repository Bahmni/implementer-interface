import React, { Component, PropTypes } from 'react';

export default class CreateFormModal extends Component {

  constructor() {
    super();
    this.formName = '';
    this.errorMessage = '';
  }

  componentDidUpdate() {
    if (this.refs.createFormModal) {
      this.refs.createFormModal.focus();
    }
  }

  setFormName(formName) {
    this.formName = formName;
    if (this.errorMessage !== '') {
      this.errorMessage = '';
      this.setState({});
    }
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }
  validateForm(e) {
    const formLength = this.formName.trim().length;
    if (formLength !== 0) {
      this.props.createForm(this.formName);
    } else {
      this.errorMessage = 'This field is required';
      this.setState({});
      e.stopPropagation();
    }
  }

  render() {
    if (this.props.showModal) {
      return (
        <div onKeyUp={(e) => this.handleEsc(e)}>
          <div className="dialog-wrapper" onClick={this.props.closeModal}></div>
          <div className="dialog">
              <div className="dialog--header">Create a Form</div>
                <form className="dialog--container" onSubmit={(e) => this.validateForm(e)}>
                  <div className="form-field clearfix">
                    <label>Form Name <span className="asterick">*</span></label>
                    <input className="form-name" onChange={(e) => this.setFormName(e.target.value)}
                      ref="createFormModal" type="text"
                    />
                    <span className="form-error">{this.errorMessage}</span>
                  </div>
                  <div className="button-wrapper fr">
                    <input className="btn--highlight" type="submit" value="Create Form" />
                    <button className="btn" onClick={this.props.closeModal} type="reset" >
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
