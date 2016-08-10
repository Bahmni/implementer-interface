import React, { Component, PropTypes } from 'react';

export default class CreateFormModal extends Component {

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
        <div className="dialog-wrapper">
          <div className="dialog">
              <div className="dialog--header">Create a Form</div>
              <div className="dialog--container">
                <div className="dialog--title">Create a new form from scratch</div>
                <div className="form-field clearfix">
                  <label>Form Name</label>
                  <input onChange={(e) => this.setFormName(e.target.value)} type="text" />
                </div>
                <div className="button-wrapper fr">
                  <button className="btn" onClick={this.props.closeModal}>Cancel</button>
                  <button
                      className="btn--highlight"
                      onClick={() => this.props.createForm(this.state.formName)}>
                    Create Form
                  </button>
                </div>
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
