import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Canvas from 'form-builder/components/Canvas';
import sinon from 'sinon';
import { getStore } from 'test/utils/storeHelper';
import { selectControl } from 'form-builder/actions/control';

chai.use(chaiEnzyme());

describe('Canvas', () => {
  const control = () => (<div></div>);

  before(() => {
    window.componentStore = {
      getDesignerComponent: () => ({
        metadata: {
          attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
        },
        control,
      }),
    };
  });

  it('should render a blank canvas with place holder text', () => {
    const canvas = mount(<Canvas formUuid="someFormUuid" store={getStore()} />);
    const placeholderText = 'Drag & Drop controls to create a form';
    expect(canvas.find('.canvas-placeholder').text()).to.eql(placeholderText);
    expect(canvas.find('.form-detail')).to.be.blank();
  });

  it('should be a drop target', () => {
    const canvas = mount(<Canvas formUuid="someFormUuid" store={getStore()} />);
    const eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => 'someType',
      },
    };

    expect(canvas.find('#form-builder-canvas')).to.have.prop('onDrop');

    sinon.spy(eventData, 'preventDefault');
    canvas.find('#form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(eventData.preventDefault);
    eventData.preventDefault.restore();
  });

  it('should render dropped controls on canvas with correct id', () => {
    const canvas = shallow(<Canvas formUuid="someFormUuid" store={getStore()} />).shallow();
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

    canvas.find('#form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(control, expectedFirstCallProps));

    canvas.find('#form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(control, expectedSecondCallProps));
  });

  it('should dispatch selectControl action when control is selected', () => {
    const store = getStore();
    const canvas = shallow(<Canvas formUuid="someFormUuid" store={store} />).shallow();
    const instance = canvas.instance();

    instance.onSelect('123');
    sinon.assert.calledOnce(store.dispatch.withArgs(selectControl('123')));
  });
});
