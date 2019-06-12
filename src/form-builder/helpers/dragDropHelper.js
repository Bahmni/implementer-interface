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
