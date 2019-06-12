import sinon from 'sinon';
import DragDropHelper from 'form-builder/helpers/dragDropHelper';

describe('dragDropHelper', () => {
  let successCallbackSpy;
  let dragSourceCellMock;
  let dropCellMock;
  let metadataMock;
  beforeEach(() => {
    successCallbackSpy = sinon.spy();
    dragSourceCellMock = {
      processMove: sinon.spy(),
      updateMetadata: sinon.spy(),
    };
    dropCellMock = { };
    metadataMock = {};
  });

  it('should call success callback and processMove if drop and drag cell is not same', () => {
    DragDropHelper.processControlDrop({
      dragSourceCell: dragSourceCellMock, dropCell: dropCellMock,
      successfulDropCallback: successCallbackSpy, metadata: metadataMock,
    });
    sinon.assert.calledOnce(successCallbackSpy);
    sinon.assert.calledOnce(dragSourceCellMock.processMove);
    sinon.assert.calledWith(dragSourceCellMock.processMove, metadataMock);
  });

  it('should call success callback and not call process move if drag source is undefined', () => {
    DragDropHelper.processControlDrop({
      dropCell: dropCellMock,
      successfulDropCallback: successCallbackSpy, metadata: metadataMock,
    });
    sinon.assert.calledOnce(successCallbackSpy);
  });

  it('should call updateMetadata & not call success callback if drop and drag cell is same', () => {
    DragDropHelper.processControlDrop({
      dragSourceCell: dragSourceCellMock,
      dropCell: dragSourceCellMock,
      successfulDropCallback: successCallbackSpy, metadata: metadataMock,
    });
    sinon.assert.notCalled(successCallbackSpy);
    sinon.assert.calledOnce(dragSourceCellMock.updateMetadata);
    sinon.assert.calledWith(dragSourceCellMock.updateMetadata, metadataMock);
  });
});

