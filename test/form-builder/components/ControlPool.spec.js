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

  function controlDescriptor(name, isTopLevelComponent) {
    return {
      [name]: {
        designProperties: {
          isTopLevelComponent,
          displayName: name,
        },
        metadata: {
          attributes: [{ name: 'label', type: 'text', defaultValue: 'someLabel' }],
        },
      },
    };
  }

  it('should render an empty listbox if no designer controls are present', () => {
    const controlPool = shallow(<ControlPool formResourceControls={[]} />);
    expect(controlPool.find('.section-content').children()).to.be.blank();
  });

  it('should render an empty listbox if register controls are not top-level', () => {
    window.componentStore.getAllRegisteredComponents = () => controlDescriptor('someName', false);
    const controlPool = shallow(<ControlPool formResourceControls={[]} />);
    expect(controlPool.find('.section-content').children()).to.be.blank();
  });

  it('should render a listbox when there are designer components', () => {
    const control1 = controlDescriptor('control1', true);
    const control2 = controlDescriptor('control2', true);
    const control3 = controlDescriptor('control3', false);
    window.componentStore.getAllDesignerComponents = () =>
      Object.assign(control1, control2, control3);

    const controlPool = shallow(<ControlPool formResourceControls={[]} />);
    expect(controlPool.find('.section-content').children()).to.have.length(2);
  });
});
