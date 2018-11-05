import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { PropertyEditor } from 'form-builder/components/PropertyEditor.jsx';
import sinon from 'sinon';
import { ComponentStore } from 'bahmni-form-controls';

chai.use(chaiEnzyme());

describe('Property Editor', () => {
  let wrapper;
  let metadata;
  let attributes;

  function controlDescriptor(attr) {
    return {
      metadata: {
        attributes: [
          { name: 'label', type: 'text', defaultValue: 'someLabel' },
          {
            name: 'properties',
            type: 'complex',
            attributes: attr,
          },
        ],
      },
    };
  }

  beforeEach(() => {
    ComponentStore.registerDesignerComponent('text', controlDescriptor());
    const properties = {
      allowDecimal: true,
      somethingElse: true,
    };

    metadata = {
      type: 'obsControl',
      properties,
      concept: {
        datatype: 'text',
      },
      unsupportedProperties: [],
    };

    attributes = [
      {
        name: 'mandatory',
        dataType: 'boolean',
        defaultValue: false,
      },
      {
        name: 'allowDecimal',
        dataType: 'boolean',
        defaultValue: false,
      },
    ];
  });

  afterEach(() => {
    ComponentStore.deRegisterDesignerComponent('text');
    ComponentStore.deRegisterDesignerComponent('obsControl');
  });

  it('should render unique Property from type and conceptType', () => {
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);
    expect(wrapper).to.have.exactly(2).descendants('Property');
  });

  it('should not render Property if property key is not present', () => {
    const descriptorWithoutProperties = {
      metadata: {
        attributes: [{ name: 'label', type: 'text', defaultValue: 'someLabel' }],
      },
    };
    ComponentStore.registerDesignerComponent('obsControl', descriptorWithoutProperties);
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);
    expect(wrapper).to.be.blank();
  });

  it('should render Property with default value when not present in metadata', () => {
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    expect(wrapper.find('Property').at(0).props().name).to.eql('mandatory');
    expect(wrapper.find('Property').at(0).props().value).to.eql(false);
  });

  it('should render Property with value from metadata if present', () => {
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    expect(wrapper.find('Property').at(1).props().name).to.eql('allowDecimal');
    expect(wrapper.find('Property').at(1).props().value).to.eql(true);
  });

  it('should render Properties from conceptType (child)', () => {
    ComponentStore.deRegisterDesignerComponent('text');
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    ComponentStore.registerDesignerComponent('text',
      controlDescriptor([{ name: 'child', dataType: 'boolean', defaultValue: true }]));

    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    expect(wrapper).to.have.exactly(3).descendants('Property');
    expect(wrapper.find('Property').at(2).props().name).to.eql('child');
    expect(wrapper.find('Property').at(2).props().value).to.eql(true);
  });

  it('should remove property from conceptType (mandatory) with disabled property', () => {
    ComponentStore.deRegisterDesignerComponent('text');
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    ComponentStore.registerDesignerComponent('text',
      controlDescriptor([
        { name: 'mandatory', dataType: 'boolean', defaultValue: false, disabled: true },
        { name: 'child', dataType: 'boolean', defaultValue: true }]));

    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    expect(wrapper).to.have.exactly(2).descendants('Property');
    expect(wrapper.find('Property').at(0).props().name).to.eql('allowDecimal');
    expect(wrapper.find('Property').at(0).props().value).to.eql(true);

    expect(wrapper.find('Property').at(1).props().name).to.eql('child');
    expect(wrapper.find('Property').at(1).props().value).to.eql(true);
  });

  it('should not render Property if there are no property attributes', () => {
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor([]));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);
    expect(wrapper).to.be.blank();
  });

  it('should update property in metadata if changed', () => {
    const spy = sinon.spy();
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={spy} />);
    wrapper.find('Property').at(1).props().onPropertyUpdate({ allowDecimal: true });

    sinon.assert.calledWith(spy, { allowDecimal: true });
  });

  it('should render Property with type when given elementType', () => {
    const attributeWithElementType = [
      {
        name: 'controlEvent',
        dataType: 'boolean',
        defaultValue: false,
        elementType: 'button',
        elementName: 'Editor',
      },
    ];
    ComponentStore.registerDesignerComponent('obsControl',
      controlDescriptor(attributeWithElementType));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    expect(wrapper.find('Property').at(0).props().name).to.eql('controlEvent');
    expect(wrapper.find('Property').at(0).props().elementType).to.eql('button');
    expect(wrapper.find('Property').at(0).props().elementName).to.eql('Editor');
  });

  it('should filter out unsupported properties from attributes', () => {
    metadata.unsupportedProperties = ['allowDecimal'];
    ComponentStore.registerDesignerComponent('obsControl', controlDescriptor(attributes));
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);

    attributes = wrapper.instance().getProperties(attributes);
    expect(attributes.length).to.eql(1);
    expect(attributes[0].props.name).to.eql('mandatory');
  });
});
