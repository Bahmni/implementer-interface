import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { PropertyEditor } from 'form-builder/components/PropertyEditor';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('PropertyEditor', () => {
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
    window.componentStore = {
      getDesignerComponent: () => controlDescriptor(),
    };

    const properties = {
      mandatory: false,
      allowDecimal: false,
      somethingElse: true,
    };

    metadata = {
      type: 'text',
      properties,
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
    delete window.componentStore;
  });

  it('should render properties if present', () => {
    window.componentStore.getDesignerComponent = () => controlDescriptor(attributes);
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);
    expect(wrapper).to.have.exactly(2).descendants('Property');
  });

  it('should not render properties if there are no property attributes', () => {
    window.componentStore.getDesignerComponent = () => controlDescriptor([]);
    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={() => {}} />);
    expect(wrapper).to.be.blank();
  });

  it('should update properties in metadata if changed', () => {
    const spy = sinon.spy();
    window.componentStore.getDesignerComponent = () => controlDescriptor(attributes);

    wrapper = shallow(<PropertyEditor metadata={metadata} onPropertyUpdate={spy} />);
    wrapper.find('Property').at(1).props().onPropertyUpdate({ allowDecimal: true });

    sinon.assert.calledWith(spy, { allowDecimal: true });
  });
});
