import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ScriptEditorModal from '../../../src/form-builder/components/ScriptEditorModal';
import sinon from 'sinon';
import { commonConstants } from 'common/constants';

chai.use(chaiEnzyme());

describe('ScriptEditorModal', () => {
  let wrapper;
  let updateScriptSpy;
  let closeSpy;

  beforeEach(() => {
    updateScriptSpy = sinon.spy();
    closeSpy = sinon.spy();
    wrapper = mount(
      <ScriptEditorModal
        close={closeSpy}
        updateScript={updateScriptSpy}
      />);
  });

  it('should render editor modal', () => {
    expect(wrapper.find('.editor-wrapper')).to.have.length(1);
    expect(wrapper.find('.button-wrapper')).to.have.length(1);
  });

  it('should update script', () => {
    wrapper.find('.editor-wrapper').simulate('change', { target: { value: 'value change' } });

    expect(wrapper.state().script).to.eql('value change');
  });

  it('should call close once click cancel button', () => {
    const cancelButton = wrapper.find('.btn');
    cancelButton.simulate('click');

    expect(cancelButton.text()).to.eql('Cancel');
    sinon.assert.calledOnce(closeSpy);
  });

  it('should call update script once click save button', () => {
    const script = 'function(){var x = 10;}';
    wrapper.find('.editor-wrapper').simulate('change', { target: { value: script } });

    const saveButton = wrapper.find('.button');
    saveButton.simulate('click');

    expect(saveButton.text()).to.eql('Save');
    sinon.assert.calledOnce(updateScriptSpy);
  });

  it('should throw error and show notification for sometime if script is invalid', () => {
    const clock = sinon.useFakeTimers();
    const expectedErrorMessage = 'Please Enter valid javascript function';
    commonConstants.toastTimeout = 1000;

    wrapper.find('.editor-wrapper').simulate('change', { target: { value: 'random value' } });
    const saveButton = wrapper.find('.button');
    saveButton.simulate('click');
    expect(wrapper.state().notification).to.eql({ type: 'error', message: expectedErrorMessage });
    expect(wrapper.find('.notification--error').text()).to.eql(expectedErrorMessage);

    clock.tick(commonConstants.toastTimeout);
    expect(wrapper.state().notification).to.eql({});
  });


  it('should trim extra spaces in the script and save', () => {
    wrapper.find('.editor-wrapper').simulate('change', { target: { value: '     ' } });

    const saveButton = wrapper.find('.button');
    saveButton.simulate('click');

    sinon.assert.calledOnce(updateScriptSpy);
  });
});
