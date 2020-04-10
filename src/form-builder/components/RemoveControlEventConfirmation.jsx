import React from 'react';
import PropTypes from 'prop-types';

const RemoveControlEventConfirmation = props => <div className="remove-control-event-container">
  <h2 className="header-title">Remove Control Event Confirmation</h2>
  <div className="remove-control-event-body">
    <div className="content">
      <span>Are you sure, you want to delete the control event?</span>
    </div>
    <div className="button-wrapper">
      <button className="btn" onClick={props.removeAndClose}
        type="reset"
      >Yes</button>
      <button className="btn btn--highlight" onClick={props.close}>No</button>
    </div>
  </div>
</div>;

RemoveControlEventConfirmation.propTypes = {
  close: PropTypes.func.isRequired,
  removeAndClose: PropTypes.func.isRequired,
};

export default RemoveControlEventConfirmation;
