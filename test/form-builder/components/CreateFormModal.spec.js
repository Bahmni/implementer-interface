import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import CreateFormModal from 'form-builder/components/CreateFormModal';
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
    wrapper = shallow(
      <CreateFormModal
        closeModal={closeModalSpy}
        createForm={createFormSpy}
        showModal={showModal}
      />
    );
  });

  it('should render create form modal when showModal is true', () => {
    expect(wrapper.find('.dialog--header').text()).to.eql('Create a Form');
    expect(wrapper.find('.dialog--title').text()).to.eql('Create a new form from scratch');
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

  it('should call create function on click of create button', () => {
    wrapper.find('input').simulate('change', { target: { value: 'Form-1' } });
    wrapper.find('.btn--highlight').simulate('click');
    sinon.assert.calledOnce(createFormSpy);
    sinon.assert.calledWith(createFormSpy, 'Form-1');
  });
});
