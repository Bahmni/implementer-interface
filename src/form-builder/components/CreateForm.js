import React, { Component, PropTypes } from 'react';

export default class CreateForm extends Component {

  constructor() {
    super();
    this.state = {};
  }

  setFormName(formName) {
    this.setState({ formName });
  }

  render() {
    if (this.props.showModal) {
      return (
        <div>
          <div className="modal-header">Create a Form</div>
          <div>
            <div className="modal-title">Create a new form from scratch</div>
            <div>Form Name</div>
            <input onChange={(e) => this.setFormName(e.target.value)} type="text" />
            <button
              className="create-button"
              onClick={() => this.props.createForm(this.state.formName)}
            >
              Create Form
            </button>
            <button className="cancel-button" onClick={this.props.closeModal}>Cancel</button>
          </div>
        </div>);
    }
    return null;
  }
}

CreateForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createForm: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
};
