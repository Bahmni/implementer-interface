/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import FormBuilderHeader from 'form-builder/components/FormBuilderHeader.jsx';

const Dashboard = () =>
  <div>
    <FormBuilderHeader />
    <div className="form-builder-link">
      <Link to="form-builder">
          <i className="fa fa-user-secret"></i>
          Form Builder
      </Link>
      <Link to="form-printer">
          <i className="fa fa-user-secret"></i>
          Print Form
      </Link>
    </div>
  </div>;

export default Dashboard;
