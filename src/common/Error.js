import React, { PropTypes } from 'react';

const Error = ({ closeErrorMessage, error }) => {
  if (error) {
    return (
      <div className="error-container">
        <div className="message">{error.message}</div>
        <button onClick={() => closeErrorMessage()}>Close</button>
      </div>);
  }
  return null;
};

Error.propTypes = {
  closeErrorMessage: PropTypes.func.isRequired,
  error: PropTypes.object,
};

export default Error;
