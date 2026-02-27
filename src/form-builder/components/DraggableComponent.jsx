/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { Component } from 'react';

export class DraggableComponent extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
  }

  onDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('data');
    this.postDragProcess(data);
  }

  postDragProcess(data) {
    return data;
  }
}
