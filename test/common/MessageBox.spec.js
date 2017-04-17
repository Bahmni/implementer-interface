import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import MessageBoxContainer from '../../src/common/MessageBox';


chai.use(chaiEnzyme());

describe('MessageBox', () => {
  it('should not render with dialog-wrapper when message is empty', () => {
    const message = {};
    const wrapper = shallow(<MessageBoxContainer message={message} />);

    expect(wrapper.find('.dialog-wrapper')).to.have.length(0);
  });


  it('should render with dialog-wrapper when message is not empty', () => {
    const message = { text: 'Test', type: 'success' };
    const wrapper = shallow(<MessageBoxContainer message={message} />);

    expect(wrapper.find('.dialog-wrapper')).to.have.length(1);
  });

  it('should render with errors when message type is error', () => {
    const message = { text: 'Test', type: 'error', failedForms: [{ file1: { name: 'file1' } }] };
    const wrapper = mount(<MessageBoxContainer message={message} />);

    expect(wrapper.find('fieldset')).to.have.length(1);
  });

  it('should not render errors when message type is success', () => {
    const message = { text: 'Test', type: 'success', failedForms: [{ file1: { name: 'file1' } }] };
    const wrapper = mount(<MessageBoxContainer message={message} />);

    expect(wrapper.find('fieldset')).to.have.length(0);
  });
});
