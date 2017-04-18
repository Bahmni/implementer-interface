import React, { PropTypes } from 'react';
import { size, filter } from 'lodash';

const ErrorContainer = ({ type, downloadResults, closeModal }) => {
  if (type === 'error') {
    const failedForms = filter(downloadResults, item => !item.success);
    const failedCount = size(failedForms);
    const successCount = size(downloadResults) - failedCount;
    const title = `Export ${successCount} Forms Successfully, ${failedCount} Forms failed.`;
    return (
      <div>
        <p>{title}</p>
        <p>Failed Forms:</p>
        <ol>
          {failedForms.map((f, key) => (
            <li key={key}>{f.name}</li>
          ))}
        </ol>
        <button className="btn--close" onClick={closeModal}>Close</button>
      </div>
    );
  }
  return null;
};

ErrorContainer.propTypes = {
  closeModal: PropTypes.func,
  downloadResults: PropTypes.object,
  type: PropTypes.string,
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
            downloadResults={props.message.downloadResults}
            type={props.message.type}
          />
        </div>
      </div>
    );
  }
  return null;
};

MessageBoxContainer.propTypes = {
  closeModal: PropTypes.func,
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    downloadResults: PropTypes.object,
  }).isRequired,
};

export default MessageBoxContainer;
