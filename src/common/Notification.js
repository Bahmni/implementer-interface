/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
