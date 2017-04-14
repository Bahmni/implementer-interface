import React, {PropTypes} from 'react';

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

        <button onClick={props.closeModal}>Close</button>
      </div>
    );
  }
  return (<div></div>);
};

const MessageBoxContainer = (props) => {
  const messageType = `notification--${props.message.type}`;

  return (
    <div className="notification">
      <div className={ messageType }>
        <div className="message">{ props.message.text }</div>
      </div>
      <ErrorContainer type={props.message.type} failedForms={props.message.failedForms} closeModal={props.closeModal}/>
    </div>
  );
};

MessageBoxContainer.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    failedForms: PropTypes.array,
  }).isRequired,
};

export default MessageBoxContainer;