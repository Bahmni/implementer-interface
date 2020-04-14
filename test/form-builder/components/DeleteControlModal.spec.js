import React from 'react';

import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import DeleteControlModal from 'form-builder/components/DeleteControlModal.jsx';
import FormHelper from 'form-builder/helpers/formHelper';
import { deleteControl } from 'form-builder/actions/control';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('DeleteControlModal', () => {
  let wrapper;
  let closeModalSpy;
  let deleteControlSpy;
  let dispatchSpy;
  let controlName;
  let controlId;
  let loadFormJsonSpy;
  const formJsonData = {
    name: 'SectionForm',
    id: 1,
    type: 'section',
    controls: [
      {
        type: 'section',
        id: 4,
        controls: [
          {
            type: 'obsControl',
            id: 2,
            concept: {
              name: 'obs1',
            },
          },
        ],
      },
      {
        type: 'obsControl',
        id: 3,
        concept: {
          name: 'obs2',
        },
        events: { onValueChange: 'func(){}' },
      },
    ],
  };

  beforeEach(() => {
    closeModalSpy = sinon.spy();
    deleteControlSpy = sinon.spy();
    dispatchSpy = sinon.spy();
    loadFormJsonSpy = () => formJsonData;
    controlId = 4;
    wrapper = shallow(
      <DeleteControlModal
        closeModal={closeModalSpy}
        controlId={controlId}
        controlName={controlName}
        deleteControl={deleteControlSpy}
        dispatch={dispatchSpy}
        loadFormJson={loadFormJsonSpy}
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
    const controlIds = [2];
    const obsControlStub = sinon.stub(FormHelper, 'getObsControlIdsForGivenControl')
      .returns(controlIds);
    wrapper.find('button').at(0).simulate('click', {
      preventDefault: () => {},
    });
    sinon.assert.calledWith(deleteControlSpy, controlId);
    sinon.assert.calledOnce(closeModalSpy);
    sinon.assert.calledOnce(dispatchSpy.withArgs(deleteControl(controlIds)));
    obsControlStub.restore();
  });
});
