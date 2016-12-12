import React from 'react';
import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { ControlPool } from 'form-builder/components/ControlPool.jsx';
import { IDGenerator } from 'bahmni-form-controls';
import { ComponentStore } from 'bahmni-form-controls';

chai.use(chaiEnzyme());

describe('ControlPool', () => {
  beforeEach(() => {
    ComponentStore.designerComponentList = {};
  });

  afterEach(() => {
    ComponentStore.designerComponentList = {};
  });

  function controlDescriptor(name, isTopLevelComponent) {
    return {
      designProperties: {
        isTopLevelComponent,
        displayName: name,
      },
      metadata: {
        attributes: [{ name: 'label', type: 'text', defaultValue: 'someLabel' }],
      },
    };
  }

  it('should render an empty listbox if no designer controls are present', () => {
    const controlPool = shallow(<ControlPool idGenerator={ new IDGenerator() } />);
    expect(controlPool.find('.section-content').children()).to.be.blank();
  });

  it('should render an empty listbox if register controls are not top-level', () => {
    ComponentStore.registerDesignerComponent('someName', controlDescriptor('someName', false));
    const controlPool = shallow(<ControlPool idGenerator={ new IDGenerator() } />);
    expect(controlPool.find('.section-content').children()).to.be.blank();
  });

  it('should render a listbox when there are designer components', () => {
    ComponentStore.registerDesignerComponent('control1', controlDescriptor('control1', true));
    ComponentStore.registerDesignerComponent('control2', controlDescriptor('control2', true));
    ComponentStore.registerDesignerComponent('control3', controlDescriptor('control3', false));

    const controlPool = mount(<ControlPool idGenerator={ new IDGenerator() } />);
    expect(controlPool.find('.section-content').children()).to.have.length(2);
  });

  it('should pass appropriate props to the children', () => {
    ComponentStore.registerDesignerComponent('control1', controlDescriptor('control1', true));

    const controlPool = mount(<ControlPool idGenerator={ new IDGenerator() } />);
    const controlPoolElements = controlPool.find('.section-content').children();

    expect(controlPoolElements).to.have.length(1);
    expect(controlPoolElements.at(0)).to.have.prop('displayName');
    expect(controlPoolElements.at(0)).to.have.prop('idGenerator');
    expect(controlPoolElements.at(0)).to.have.prop('metadata');
  });
});
