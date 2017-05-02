import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import TitleDetail from 'form-builder/components/TitleDetail';

chai.use(chaiEnzyme());

describe('TitleDetail', () => {
  const value = 'Test';
  it('should return label element with given title', () => {
    const wrapper = shallow(
      <TitleDetail value={value} />
    );
    expect(wrapper.find('label').text()).to.eql(value);
  });

  it('should return input element with given title after double click', () => {
    const wrapper = shallow(
      <TitleDetail value={value} />
    );
    const label = wrapper.find('label');
    label.simulate('doubleclick');
    expect(wrapper.state('isEditable')).to.equals(true);
    expect(wrapper.find('input').props().defaultValue).to.be.eql(value);
  });

  it('should become not editable when blur', () => {
    const wrapper = shallow(
      <TitleDetail updateValue={() => {
      }} value={value}
      />
    );
    wrapper.setState({ isEditable: true });
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Hello' } });
    input.simulate('blur');
    expect(wrapper.state('isEditable')).to.equal(false);
  });

  it('should become not editable when press enter', () => {
    const wrapper = shallow(
      <TitleDetail updateValue={() => {
      }} value={value}
      />
    );
    wrapper.setState({ isEditable: true });
    const input = wrapper.find('input');
    input.simulate('focus');
    input.simulate('change', { target: { value: 'Hello' } });
    input.simulate('keyUp', { keyCode: 13 });
    expect(wrapper.state('isEditable')).to.equal(false);
  });

  it('should show red when enter some value after form name length has equal 50', () => {
    const wrapper = shallow(
          <TitleDetail updateValue={() => {
          }} validateNameLength={() => true} value={value}
          />
      );
    const label = wrapper.find('label');
    label.simulate('doubleclick');
    const input = wrapper.find('input');
    input.simulate('keyPress', { keyCode: 13, target: {
      value: '12345678901234567890123456789012345678901234567890a' } });

    expect(wrapper.state('red')).to.equal(true);
  });

  it('should not show red when enter some value after form name length less than 50', () => {
    const wrapper = shallow(
          <TitleDetail updateValue={() => {
          }} validateNameLength={() => false} value={value}
          />
      );
    const label = wrapper.find('label');
    label.simulate('doubleclick');
    wrapper.instance().validateNameLength('1234567890a');

    expect(wrapper.state('red')).to.equal(false);
  });
});
