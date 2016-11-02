import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { Property } from 'form-builder/components/Property.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('Property', () => {
  let wrapper;

  it('should render property', () => {
    wrapper = shallow(<Property name="mandatory" onPropertyUpdate={() => {}} value={false} />);
    expect(wrapper.find('label').text()).to.eql('mandatory');
    expect(wrapper.find('input').props().type).to.eql('checkbox');
    expect(wrapper.find('input').props().checked).to.eql(false);
  });

  it('should call update property on selection of checkbox', () => {
    const spy = sinon.spy();

    wrapper = shallow(<Property name="mandatory" onPropertyUpdate={spy} value />);
    wrapper.find('input').props().onChange({ target: { checked: true } });
    sinon.assert.calledWith(spy, { mandatory: true });
  });
});
