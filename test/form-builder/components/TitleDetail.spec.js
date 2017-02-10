import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import TitleDetail from 'form-builder/components/TitleDetail';

chai.use(chaiEnzyme());

describe('TitleDetail', () => {
  const value = 'Test';

  describe('When not editable', () => {
    it('should return label element', () => {
      const wrapper = shallow(
        <TitleDetail value={value} />
      );
      expect(wrapper.find('label').text()).to.eql(value);
    });
  });

  describe('When editable', () => {
    it('should return input element', () => {
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
        <TitleDetail updateValue={() => {}} value={value} />
      );
      wrapper.setState({ isEditable: true });
      const input = wrapper.find('input');
      input.simulate('focus');
      input.simulate('change', { target: { value: 'Hello' } });
      input.simulate('blur');
      expect(wrapper.state('isEditable')).to.equal(false);
    });
    it('should become not editable when keyUp', () => {
      const wrapper = shallow(
        <TitleDetail updateValue={() => {}} value={value} />
      );
      wrapper.setState({ isEditable: true });
      const input = wrapper.find('input');
      input.simulate('focus');
      input.simulate('change', { target: { value: 'Hello' } });
      input.simulate('keyUp', { keyCode: 13 });
      expect(wrapper.state('isEditable')).to.equal(false);
    });
  });
});
