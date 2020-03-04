import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Canvas } from 'form-builder/components/Canvas.jsx';
import sinon from 'sinon';
import { getStore } from 'test/utils/storeHelper';
import { blurControl, deselectControl, dragSourceUpdate } from 'form-builder/actions/control';
import { IDGenerator } from 'bahmni-form-controls';
import { ComponentStore } from 'bahmni-form-controls';
import DragDropHelper from 'form-builder/helpers/dragDropHelper';
chai.use(chaiEnzyme());

describe('Canvas', () => {
  let componentStoreStub;
  const control = () => (<div className="dummy-div">Dummy Div</div>);
  before(() => {
    componentStoreStub = sinon.stub(ComponentStore, 'getDesignerComponent');

    componentStoreStub.withArgs('grid').returns({
      control: () => (<div className="dummy-grid">Dummy Grid</div>),
    });
    componentStoreStub.withArgs('random').returns(undefined);
    componentStoreStub.returns({
      metadata: {
        attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
      },
      control,
    });
  });

  after(() => {
    componentStoreStub.restore();
  });


  it('should render a blank canvas with grid and place holder text', () => {
    const idGenerator = new IDGenerator();
    const canvas = mount(
      <Canvas
        formId={1}
        formName="formName"
        formResourceControls={[]}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
        store={getStore()}
      />);
    const placeholderText = 'Drag & Drop controls to create a form';
    expect(canvas.find('.canvas-placeholder').text()).to.eql(placeholderText);
    expect(canvas.find('.form-detail')).to.be.blank();
  });

  it('should pass the appropriate props to the grid', () => {
    const idGenerator = new IDGenerator();
    const canvas = mount(
      <Canvas
        formId={1}
        formName="formName"
        formResourceControls={[]}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
        showDeleteButton
        store={getStore()}
      />);

    const grid = canvas.find('GridDesigner');
    expect(grid).to.have.prop('controls');
    expect(grid.prop('controls')).to.deep.eql([]);

    expect(grid).to.have.prop('idGenerator');
    expect(grid.prop('idGenerator')).to.eql(idGenerator); // reference equality

    expect(grid.prop('showDeleteButton')).to.eql(true);
    expect(grid).to.have.prop('wrapper');
  });

  it('should clear selected id and focused Control id when clicked on canvas', () => {
    const idGenerator = new IDGenerator();
    const store = getStore();
    const canvas = mount(
      <Canvas
        dispatch={store.dispatch}
        formId={1}
        formName="formName"
        formResourceControls={[]}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
      />);
    canvas.find('.form-builder-canvas').simulate('click');
    sinon.assert.calledOnce(store.dispatch.withArgs(deselectControl()));
    sinon.assert.calledOnce(store.dispatch.withArgs(blurControl()));
  });

  it('should change the name when updateFormName called', () => {
    const idGenerator = new IDGenerator();
    const store = getStore();

    const canvas = shallow(
      <Canvas
        formId={1}
        formName="formName"
        formResourceControls={[]}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
        store={store}
        updateFormName={ (name) => name }
      />);
    canvas.find('TitleDetail').prop('updateValue')('testName');
    expect(canvas.state('formName')).to.eql('testName');
  });

  it('should pass metadata to controls from Form Resource', () => {
    const idGenerator = new IDGenerator();
    const store = getStore();

    const formResourceJSON = [
      {
        id: '1',
        type: 'obsControl',
      },
      {
        id: '2',
        type: 'random',
      },
    ];
    const canvas = shallow(
      <Canvas
        dispatch={store.dispatch}
        formId={1}
        formName="formName"
        formResourceControls={formResourceJSON}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
      />);
    const instance = canvas.instance();
    expect(instance.state.descriptors.length).to.eql(1);
    expect(instance.state.descriptors[0].metadata).to.deep.eql({ id: '1', type: 'obsControl' });
  });


  it('should reset the drag source to undefined after the drop is done', () => {
    const idGenerator = new IDGenerator();
    const store = getStore();

    const formResourceJSON = [
      {
        id: '1',
        type: 'obsControl',
      },
      {
        id: '2',
        type: 'random',
      },
    ];
    const canvasWrapper = shallow(
      <Canvas
        dispatch={store.dispatch}
        formId={1}
        formName="formName"
        formResourceControls={formResourceJSON}
        formUuid="someFormUuid"
        formVersion="1"
        idGenerator={idGenerator}
      />);

    const instance = canvasWrapper.instance();
    const dragDrophelperStub = sinon.stub(DragDropHelper, 'processControlDrop');
    instance.handleControlDrop({ metadata: {} });
    sinon.assert.calledOnce(store.dispatch.withArgs(dragSourceUpdate(undefined)));
    dragDrophelperStub.restore();
  });
});
