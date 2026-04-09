/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import React, { Component } from 'react';

export default class FormList extends Component {
  constructor(props) {
    super(props);

    this.downloadFile = this.downloadFile.bind(this);
  }
  downloadFile() {
    window.open(this.props.downloadLink);
  }
  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Form Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>

            <tr >
              <td>{this.props.status}</td>
              <td>
                <button onClick={this.downloadFile} disabled={this.props.status != 'Completed'} >Download</button>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    );
  }
}
