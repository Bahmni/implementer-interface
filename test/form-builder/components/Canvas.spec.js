import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Canvas from 'form-builder/components/Canvas';
import sinon from 'sinon';
import { getStore } from 'test/utils/storeHelper';
import { addSourceMap, deselectControl } from 'form-builder/actions/control';

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

  context('should dispatch addToSourceMap', () => {
    const formResource = [
      {
        id: '1',
        type: 'obsControl',
        concept: {
          name: 'someName-1',
          uuid: 'someUuid-1',
          datatype: 'Numeric',
        },
        properties: {
          location: {
            row: 0,
            column: 0,
          },
        },
      },
      {
        id: '2',
        type: 'random',
        properties: {
          location: {
            row: 0,
            column: 1,
          },
        },
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
    let wrapper;
    it('on mount', () => {
      const store = getStore();
      shallow(
        <Canvas
          formResourceControls={ formResource }
          formUuid="someFormUuid"
          store={ store }
        />).shallow();
      sinon.assert.calledOnce(store.dispatch.withArgs(addSourceMap(expectedSourceMap)));
    });

    it('on update of props', () => {
      const store = getStore();
      wrapper = shallow(
        <Canvas
          formResourceControls={ formResource }
          formUuid="someFormUuid"
          store={ store }
        />).shallow();

      wrapper.setProps({ formUuid: 'someUuid' });
      sinon.assert.calledTwice(store.dispatch.withArgs(addSourceMap(expectedSourceMap)));
    });
  });
});
