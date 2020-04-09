import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { deleteControl } from 'form-builder/actions/control';

export default class DeleteControlModal extends Component {

  deleteControl(e) {
    e.preventDefault();
    this.props.deleteControl(this.props.controlId);
    this.props.closeModal();
    this.props.dispatch(deleteControl(this.props.controlId));
  }

  handleEsc(e) {
    if (e.keyCode === 27) {
      this.props.closeModal();
    }
  }

  render() {
    return (
          <div onKeyUp={(e) => this.handleEsc(e)}>
              <div className="dialog-wrapper" onClick={this.props.closeModal}></div>
              <div className="dialog">
                <h2 className="header-title">Delete</h2>
                  <div className="dialog--container">
                      Are you sure you want to delete this control?
                  </div>
                  <div className="button-wrapper fr">
                      <button autoFocus className="button btn--highlight"
                        onClick={(e) => this.deleteControl(e)} type="submit"
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
}

DeleteControlModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  controlId: PropTypes.string,
  controlName: PropTypes.string,
  deleteControl: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
