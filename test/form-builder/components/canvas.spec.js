import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import Canvas from 'form-builder/components/Canvas';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Canvas', () => {
  const designerControl = () => (<div></div>);

  before(() => {
    window.componentStore = {
      getRegisteredComponent: () => ({
        metadata: {
          attributes: [{ name: 'properties', dataType: 'complex', attributes: [] }],
        },
        designerControl,
      }),
    };
  });

  after(() => {
  });

  it('should render a blank canvas with place holder text', () => {
    const canvas = shallow(<Canvas formUuid="someFormUuid" />);
    const placeholderText = 'Drag & Drop controls to create a form';
    expect(canvas.find('.canvas-placeholder').text()).to.eql(placeholderText);
    expect(canvas.find('.form-detail')).to.be.blank();
  });

  it('should be a drop target', () => {
    const canvas = mount(<Canvas formUuid="someFormUuid" />);
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

  it('should render dropped component on canvas with correct id', () => {
    const canvas = mount(<Canvas formUuid="someFormUuid" />);
    const eventData = {
      preventDefault: () => {},
      dataTransfer: {
        getData: () => JSON.stringify({ metadata: {} }),
      },
    };

    const expectedFirstCallProps = {
      key: '1',
      metadata: { id: '1', properties: { isDesignMode: true } },
      ref: sinon.match.any,
    };

    const expectedSecondCallProps = {
      key: '2',
      metadata: { id: '2', properties: { isDesignMode: true } },
      ref: sinon.match.any,
    };

    const createElementSpy = sinon.spy(React, 'createElement');

    canvas.find('#form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(designerControl, expectedFirstCallProps));

    canvas.find('#form-builder-canvas').props().onDrop(eventData);
    sinon.assert.calledOnce(createElementSpy.withArgs(designerControl, expectedSecondCallProps));
  });
});
