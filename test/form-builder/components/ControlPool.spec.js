import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlPool } from 'form-builder/components/ControlPool';

chai.use(chaiEnzyme());

describe('ControlPool', () => {
  beforeEach(() => {
    window.componentStore = {
      getAllDesignerComponents: () => {},
    };
  });

  afterEach(() => {
    delete window.componentStore;
  });

  function controlDescriptor(name) {
    return {
      [name]: {
        designProperties: {
          displayName: name,
        },
        metadata: {
          attributes: [],
        },
      },
    };
  }

  it('should render an empty listbox if no designer controls are present', () => {
    const controlPool = shallow(<ControlPool />);
    expect(controlPool.find('.controls-list')).to.be.blank();
  });

  it('should render a listbox when there are designer components', () => {
    const control1 = controlDescriptor('control1');
    const control2 = controlDescriptor('control2');
    const control3 = controlDescriptor('control3');
    window.componentStore.getAllDesignerComponents = () =>
      Object.assign(control1, control2, control3);

    const controlPool = shallow(<ControlPool />);
    expect(controlPool.find('.controls-list').children().at(0).text()).to.eql('control1');
    expect(controlPool.find('.controls-list').children().at(1).text()).to.eql('control2');
    expect(controlPool.find('.controls-list').children()).to.have.length(3);
  });

  it('should add draggable properties', () => {
    const controls = controlDescriptor('control1', true);
    window.componentStore.getAllDesignerComponents = () => controls;

    const eventData = {
      dataTransfer: {
        setData: (type, data) => ({ data, type }),
      },
    };
    const controlPool = shallow(<ControlPool />);
    const dragData = controlPool.find('.controls-list').children().props().onDragStart(eventData);

    expect(dragData.type).to.eql('data');
    expect(dragData.data).to.deep.eql('control1');
    expect(controlPool.find('.controls-list').children().props().draggable).to.eql('true');
  });
});
