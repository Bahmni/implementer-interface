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

  it('should render button when given property with button type', () => {
    const type = 'button';

    wrapper = shallow(<Property
      elementType={type}
      name="control Event"
      onPropertyUpdate={() => {}}
      value={false}
    />);

    expect(wrapper).to.have.exactly(1).descendants('button');
    expect(wrapper.find('button').props().className).to.eql('control-event-button');
  });

  it('should call property update once click the editor button', () => {
    const spy = sinon.spy();

    wrapper = shallow(<Property
      elementName="Editor"
      elementType="button"
      name="controlEvent"
      onPropertyUpdate={spy}
      value
    />);

    wrapper.find('button').props().onClick({ target: { checked: true } });

    sinon.assert.calledWith(spy, { controlEvent: true });
  });
});
