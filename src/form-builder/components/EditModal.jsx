import React, { Component, PropTypes } from 'react';

export default class EditModal extends Component {

  constructor() {
    super();
    this.editForm = this.editForm.bind(this);
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }

  editForm(e) {
    e.preventDefault();
    this.props.editForm(this.formData);
    this.props.closeModal();
  }

  render() {
    if (this.props.showModal) {
      return (
            <div onKeyUp={(e) => this.handleEsc(e)}>
                <div className="dialog-wrapper" onClick={this.props.closeModal}></div>
                <div className="dialog dialog--no-header">
                    <div className="dialog--container">
                        Edit of the form will allow you to create a new version of form.
                        Do you want to proceed?
                    </div>
                    <div className="button-wrapper fr">
                        <button autoFocus className="button btn--highlight"
                          onClick={(e) => this.editForm(e)} type="submit"
                        >
                            OK
                        </button>
                        <button className="btn" onClick={this.props.closeModal} type="reset">
                          Cancel
                        </button>
                    </div>
                </div>
            </div>
      );
    }
    return null;
  }
}

EditModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  editForm: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
