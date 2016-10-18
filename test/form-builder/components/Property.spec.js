import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Property } from 'form-builder/components/Property';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Property', () => {
  let wrapper;

  it('should render property', () => {
    const property = {
      name: 'mandatory',
      dataType: 'boolean',
      defaultValue: false,
    };

    wrapper = shallow(<Property description={property} onPropertyUpdate={() => {}} />);
    expect(wrapper.find('label').text()).to.eql('mandatory');
    expect(wrapper.find('input').props().type).to.eql('checkbox');
    expect(wrapper.find('input').props().value).to.eql(false);
  });

  it('should call update property on selection of checkbox', () => {
    const property = {
      name: 'mandatory',
      dataType: 'boolean',
      defaultValue: false,
    };
    const onPropertyUpdateSpy = sinon.spy();

    wrapper = shallow(<Property description={property} onPropertyUpdate={onPropertyUpdateSpy} />);
    wrapper.find('input').simulate('click', { target: { checked: true } });
    sinon.assert.calledWith(onPropertyUpdateSpy, { mandatory: true });
  });
});
