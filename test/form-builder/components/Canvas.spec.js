import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Canvas from 'form-builder/components/Canvas';
import sinon from 'sinon';
import { getStore } from 'test/utils/storeHelper';
import { addSourceMap, deselectControl, selectControl } from 'form-builder/actions/control';

chai.use(chaiEnzyme());

describe('Canvas', () => {
  const control = () => (<div className="dummy-div">Dummy Div</div>);
  const componentStore = window.componentStore;
  before(() => {
    window.componentStore = {
      getDesignerComponent: (type) => {
        if (type === 'grid') {
          return ({
            control: () => (<div className="dummy-grid">Dummy Grid</div>),
          });
        } else if (type === 'random') {
          return undefined;
        }
        return ({
          metadata: {
            attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
          },
          control,
        });
      },
    };
  });

  after(() => {
    window.componentStore = componentStore;
  });

  it('should render a blank canvas with grid and place holder text', () => {
    const canvas = mount(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid"
        store={getStore()}
      />);
    const placeholderText = 'Drag & Drop controls to create a form';
    expect(canvas.find('.canvas-placeholder').text()).to.eql(placeholderText);
    expect(canvas.find('.form-detail')).to.be.blank();
  });

  it('should be a drop target', () => {
    const canvas = mount(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid"
        store={getStore()}
      />);
    const eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify({ type: 'someType' }),
      },
    };

    expect(canvas.find('.form-builder-canvas')).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    canvas.find('.form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('should render dropped controls on canvas with correct id', () => {
    const canvas = shallow(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid"
        store={getStore()}
      />).shallow();
    const canvasInstance = canvas.instance();
    const eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify({ metadata: {} }),
      },
    };

    const expectedFirstCallProps = {
      key: '1',
      metadata: { id: '1', properties: {} },
      ref: sinon.match.any,
      onSelect: canvasInstance.onSelect,
    };

    const expectedSecondCallProps = {
      key: '2',
      metadata: { id: '2', properties: {} },
      ref: sinon.match.any,
      onSelect: canvasInstance.onSelect,
    };

    const createElementSpy = sinon.spy(React, 'createElement');

    canvas.find('.form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(control, expectedFirstCallProps));

    canvas.find('.form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(control, expectedSecondCallProps));
  });

  it('should dispatch selectControl action when control is selected', () => {
    const store = getStore();
    const canvas = shallow(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid"
        store={store}
      />).shallow();
    const instance = canvas.instance();
    const event = { stopPropagation: sinon.spy() };

    instance.onSelect(event, '123');
    sinon.assert.calledOnce(event.stopPropagation);
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl('123')));
  });

  it('should update descriptors with concepts on change of conceptToControlMap', () => {
    const store = getStore();
    const canvas = shallow(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid"
        store={store}
      />).shallow();
    const instance = canvas.instance();

    const descriptor = { control: () => (<div></div>), metadata: { id: '1', type: 'obsControl' } };
    instance.setState({ descriptors: [descriptor] });

    const conceptToControlMap = {
      1: {
        uuid: 'c37bd733-3f10-11e4-adec-0800271c1b75',
        display: 'Temperature',
        name: {
          uuid: 'c37bdec5-3f10-11e4-adec-0800271c1b75',
          name: 'Temperature',
        },
        conceptClass: {
          uuid: '8d492774-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Misc',
        },
        datatype: {
          uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
          name: 'Numeric',
        },
        setMembers: [],
      },
    };
    canvas.setProps({ conceptToControlMap });
    const concept = {
      name: 'Temperature',
      uuid: 'c37bd733-3f10-11e4-adec-0800271c1b75',
    };

    expect(instance.state.descriptors.length).to.eql(1);
    expect(instance.state.descriptors[0].metadata.displayType).to.eql('Numeric');
    expect(instance.state.descriptors[0].metadata.concept).to.eql(concept);
  });

  it('should clear selected id when clicked on canvas', () => {
    const store = getStore();
    const canvas = mount(
      <Canvas
        formResourceControls={[]}
        formUuid="someFormUuid" store={store}
      />);
    canvas.find('.form-builder-canvas').simulate('click');
    sinon.assert.calledOnce(store.dispatch.withArgs(deselectControl()));
  });

  it('should render form controls from Form Resource json if present already', () => {
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
    const canvas = mount(
      <Canvas
        formResourceControls={formResourceJSON}
        formUuid="someFormUuid"
        store={store}
      />);

    expect(canvas.find('.dummy-div').text()).to.eql('Dummy Div');
    expect(canvas.find('.dummy-grid').text()).to.eql('Dummy Grid');
  });

  it('should pass metadata to controls from Form Resource', () => {
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
        formResourceControls={formResourceJSON}
        formUuid="someFormUuid"
        store={store}
      />).shallow();
    const instance = canvas.instance();
    expect(instance.state.descriptors.length).to.eql(1);
    expect(instance.state.descriptors[0].metadata).to.deep.eql({ id: '1', type: 'obsControl' });
  });

  it('should dispatch addToSourceMap', () => {
    const store = getStore();
    const formResource = [
      {
        id: '1',
        type: 'obsControl',
        concept: {
          name: 'someName-1',
          uuid: 'someUuid-1',
        },
        displayType: 'Numeric',
      },
      {
        id: '2',
        type: 'random',
      },
    ];
    const expectedSourceMap = {
      1: {
        name: { name: 'someName-1' },
        uuid: 'someUuid-1',
        datatype: { name: 'Numeric' },
        display: 'someName-1',
      },
    };

    mount(<Canvas formResourceControls={formResource} formUuid="someFormUuid" store={store} />);
    sinon.assert.calledOnce(store.dispatch.withArgs(addSourceMap(expectedSourceMap)));
  });
});
