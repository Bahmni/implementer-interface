import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import DeleteControlModal from 'form-builder/components/DeleteControlModal.jsx';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('DeleteControlModal', () => {
  let wrapper;
  let closeModalSpy;
  let deleteControlSpy;
  let dispatchSpy;
  let controlName;
  let controlId;

  beforeEach(() => {
    closeModalSpy = sinon.spy();
    deleteControlSpy = sinon.spy();
    dispatchSpy = sinon.spy();
    controlId = 4;
    wrapper = shallow(
      <DeleteControlModal
        closeModal={closeModalSpy}
        controlId={controlId}
        controlName={controlName}
        deleteControl={deleteControlSpy}
        dispatch={dispatchSpy}
      />
    );
  });

  it('should render delete control modal', () => {
    expect(wrapper.find('.dialog-wrapper').prop('onClick')).to.eql(closeModalSpy);
    expect(wrapper.find('.button-wrapper')).to.have.exactly(2).descendants('button');
  });

  it('should close when cancel clicked', () => {
    wrapper.find('.btn').simulate('click');

    sinon.assert.calledOnce(closeModalSpy);
  });

  it('should close when ESC is pressed', () => {
    const wrapperDiv = wrapper.find('div').at(0);

    const aKey = 88;
    wrapperDiv.simulate('keyUp', { keyCode: aKey });

    expect(closeModalSpy.called).to.eql(false);

    const escKey = 27;
    wrapperDiv.simulate('keyUp', { keyCode: escKey });

    sinon.assert.calledOnce(closeModalSpy);
  });

  it('should delete control when OK button clicked', () => {
    wrapper.find('button').at(0).simulate('click', {
      preventDefault: () => {},
    });
    sinon.assert.calledWith(deleteControlSpy, controlId);
    sinon.assert.calledOnce(closeModalSpy);
  });
});
