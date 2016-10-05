import React, { Component, PropTypes } from 'react';
import map from 'lodash/map';

const Notification = ({ closeMessage, id, type, message }) => {
  const notificationType = `notification--${type}`;
  return (
    <div className="notification">
      <div className={notificationType}>
        <div className="message">{message}</div>
        <button className="btn--close" onClick={() => closeMessage(id)}>Close</button>
      </div>
    </div>);
};

Notification.propTypes = {
  closeMessage: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  message: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default class NotificationContainer extends Component {
  getToasts() {
    return map(this.props.notifications, (notification, index) =>
      <Notification
        closeMessage={this.props.closeMessage}
        id={index}
        key={index}
        {...notification}
      />);
  }

  render() {
    return <div>{this.getToasts()}</div>;
  }
}

NotificationContainer.propTypes = {
  closeMessage: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string.isRequired,
  })).isRequired,
};
