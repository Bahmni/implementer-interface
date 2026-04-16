/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export class IDGenerator {
  constructor(controls = []) {
    this.controlIDs = this.getControlIDs(controls);
    this.maxId = Math.max(...this.controlIDs) || 0;
    this.maxId = this.maxId === -Infinity ? 1 : this.maxId + 1;
  }

  getControlIDs(controls) {
    const controlIDs = controls.map(control => {
      if (control.controls) {
        return [].concat(control.id, this.getControlIDs(control.controls));
      }
      return control.id;
    });
    return [].concat(...controlIDs);
  }

  getId() {
    return this.maxId++;
  }
}
