import React, { Component, PropTypes } from 'react';

export default class DeleteControlModal extends Component {

  deleteControl(e) {
    e.preventDefault();
    this.props.deleteControl();
    this.props.closeModal();
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
                     Are you sure want to delete this control?
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
  controlName: PropTypes.string,
  deleteControl: PropTypes.func.isRequired,
};
