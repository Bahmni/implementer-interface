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
import { Draggable } from 'bahmni-form-controls';

export class ControlPoolElement extends Draggable {
  constructor(props) {
    super(props);
    this.idGenerator = props.idGenerator;
    this.processDragStart = this.processDragStart.bind(this);
  }

  processDragStart(metadata) {
    const id = String(this.idGenerator.getId());
    return Object.assign({}, metadata, { id });
  }

  render() {
    return (
      <div
        className="control-list"
        draggable="true"
        onDragStart={this.onDragStart(this.props.metadata)}
      >
        {this.props.displayName}
      </div>);
  }
}

ControlPoolElement.propTypes = {
  displayName: PropTypes.string.isRequired,
  idGenerator: PropTypes.object.isRequired,
  metadata: PropTypes.object.isRequired,
};

