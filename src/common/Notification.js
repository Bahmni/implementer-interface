import React from 'react';
import PropTypes from 'prop-types';

const NotificationContainer = (props) => {
  const { message, type } = props.notification;
  const notificationType = `notification--${type}`;
  if (type && message) {
    return (
      <div className="notification">
        <div className={ notificationType }>
          <div className="message">{ message }</div>
        </div>
      </div>);
  }
  return null;
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default NotificationContainer;
