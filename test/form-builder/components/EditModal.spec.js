import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import EditModal from 'form-builder/components/EditModal.jsx';

chai.use(chaiEnzyme());

describe('EditModal', () => {
  let wrapper;
  let closeModalSpy;
  let editFormSpy;
  let showModal;

  beforeEach(() => {
    closeModalSpy = sinon.spy();
    editFormSpy = sinon.spy();
    showModal = true;
    wrapper = mount(
      <EditModal
        closeModal={closeModalSpy}
        editForm={editFormSpy}
        showModal={showModal}
      />
    );
  });

  it('should render create form modal when showModal is true', () => {
    expect(wrapper.find('.dialog--container').text())
      .to.eql('Edit of the form will allow you to create' +
      ' a new version of form. Do you want to proceed?');
  });

  it('should not render create form modal when showModal is false', () => {
    wrapper = shallow(
      <EditModal closeModal={closeModalSpy} editForm={editFormSpy} showModal={false} />
    );
    expect(wrapper).to.not.have.descendants('div');
  });

  it('should call close modal function when keycode is 27', () => {
    const event = {
      preventDefault: () => {},
      keyCode: 27,
    };

    wrapper = shallow(
      <EditModal closeModal={closeModalSpy} editForm={editFormSpy} showModal={false} />
    );

    wrapper.instance().handleEsc(event);

    sinon.assert.calledOnce(closeModalSpy);
  });

  it('should call close modal function when edit form', () => {
    const event = {
      preventDefault: () => {},
    };

    wrapper = shallow(
      <EditModal closeModal={closeModalSpy} editForm={editFormSpy} showModal={false} />
    );

    wrapper.instance().editForm(event);

    sinon.assert.calledOnce(closeModalSpy);
    sinon.assert.calledOnce(editFormSpy);
  });
});
