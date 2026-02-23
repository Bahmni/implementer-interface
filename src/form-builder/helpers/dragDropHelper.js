/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

export default class DragDropHelper {
  static dragAndDropLocationIsSame(dragCell, dropCell) {
    return dragCell === dropCell;
  }

  static processControlDrop({ dragSourceCell, dropCell, successfulDropCallback, metadata }) {
    if (!this.dragAndDropLocationIsSame(dragSourceCell, dropCell)) {
      if (dragSourceCell && dragSourceCell.processMove) {
        dragSourceCell.processMove(metadata);
      }
      successfulDropCallback(metadata);
    } else {
      dragSourceCell.updateMetadata(metadata);
    }
  }
}
