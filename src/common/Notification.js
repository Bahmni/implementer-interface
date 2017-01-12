import React, { PropTypes } from 'react';

const NotificationContainer = (props) => {
  const notificationType = `notification--${props.notification.type}`;
  return (
        <div className="notification">
          <div className={ notificationType }>
            <div className="message">{ props.notification.message }</div>
          </div>
        </div>);
};

NotificationContainer.propTypes = {
  notification: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
};

export default NotificationContainer;
