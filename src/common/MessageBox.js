import React, { PropTypes } from 'react';

const ErrorContainer = (props) => {
  if (props.type === 'error') {
    return (
      <div>
        <span>Export Forms Successfully, Forms failed. Failed Forms: </span>
        <fieldset>
          {props.failedForms.map((f, key) => (
            <ul key={key}>{f.name}</ul>
          ))}
        </fieldset>

        <button className="btn--close" onClick={props.closeModal}>Close</button>
      </div>
    );
  }
  return null;
};

const MessageBoxContainer = (props) => {
  const messageType = `notification--${props.message.type}`;
  if (props.message.text) {
    return (
      <div>
        <div className="dialog-wrapper"></div>;
        <div className="notification">
          <div className={ messageType }>
            <div className="message">{ props.message.text }</div>
          </div>
          <ErrorContainer closeModal={props.closeModal}
            failedForms={props.message.failedForms} type={props.message.type}
          />
        </div>
      </div>
    );
  }

  return null;
};

MessageBoxContainer.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    failedForms: PropTypes.array,
  }).isRequired,
};

export default MessageBoxContainer;
