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

const Spinner = (props) => {
  if (props.show) {
    return (<div className="overlay"></div>);
  }
  return null;
};

Spinner.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Spinner;
