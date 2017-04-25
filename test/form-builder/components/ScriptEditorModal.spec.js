import React from 'react';
import { shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ScriptEditorModal from '../../../src/form-builder/components/ScriptEditorModal';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('ScriptEditorModal', () => {
  let wrapper;
  let updateScriptSpy;
  let closeSpy;

  beforeEach(() => {
    updateScriptSpy = sinon.spy();
    closeSpy = sinon.spy();
    wrapper = shallow(
      <ScriptEditorModal
        updateScript={updateScriptSpy}
        close={closeSpy}
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
    const saveButton = wrapper.find('.button');
    saveButton.simulate('click');

    expect(saveButton.text()).to.eql('Save');
    sinon.assert.calledOnce(updateScriptSpy);
  });
});
