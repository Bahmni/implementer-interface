import React from 'react';

import { shallow, mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import CreateFormModal from 'form-builder/components/CreateFormModal.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('CreateFormModal', () => {
  let wrapper;
  let closeModalSpy;
  let createFormSpy;
  let showModal;

  beforeEach(() => {
    closeModalSpy = sinon.spy();
    createFormSpy = sinon.spy();
    showModal = true;
    wrapper = mount(
      <CreateFormModal
        closeModal={closeModalSpy}
        createForm={createFormSpy}
        showModal={showModal}
      />
    );
  });

  it('should render create form modal when showModal is true', () => {
    expect(wrapper.find('.header-title').text()).to.eql('Create a Form');
  });

  it('should not render create form modal when showModal is false', () => {
    wrapper = shallow(
      <CreateFormModal closeModal={closeModalSpy} createForm={createFormSpy} showModal={false} />
    );
    expect(wrapper).to.not.have.descendants('div');
  });

  it('should call closeModal function on click of close button', () => {
    wrapper.find('.btn').simulate('click');
    sinon.assert.calledOnce(closeModalSpy);
  });

  it('should call closeModal function on enter a value', () => {
    const input = wrapper.find('.form-name');
    input.simulate('keyUp', { keyCode: 27 });
    sinon.assert.calledOnce(closeModalSpy);
  });

  it('should call create function on click of create button', () => {
    const event = {
      preventDefault: () => {},
    };

    wrapper.find('.form-name').simulate('change', { target: { value: 'Form1' } });
    wrapper.find('.dialog--container').props().onSubmit(event);
    sinon.assert.calledOnce(createFormSpy);
    sinon.assert.calledWith(createFormSpy, 'Form1');
  });

  it('should trim input before calling createForm', () => {
    const event = {
      preventDefault: () => {},
    };

    wrapper.find('.form-name').simulate('change', { target: { value: 'Form1  ' } });
    wrapper.find('.dialog--container').props().onSubmit(event);
    sinon.assert.calledOnce(createFormSpy);
    sinon.assert.calledWith(createFormSpy, 'Form1');
  });

  it('should show notification when form name more than 50 characters', () => {
    wrapper.find('.form-name').simulate('change', { target:
        { value: '12345678901234567890123456789012345678901234567890w' } });
    wrapper.update();
    expect(wrapper.find('NotificationContainer').prop('notification')).to.eql({
      message: 'Form name shall not exceed 50 characters',
      type: 'error',
    });
    expect(wrapper.state('red')).to.equal(true);
    expect(wrapper.state('buttonDisable')).to.equal(true);
  });

  it('should not show error when form name less than 50 characters', () => {
    const name = '1234567890';
    wrapper.instance().validateName(name);

    expect(wrapper.state('red')).to.equal(false);
    expect(wrapper.state('buttonDisable')).to.equal(false);
  });
});
