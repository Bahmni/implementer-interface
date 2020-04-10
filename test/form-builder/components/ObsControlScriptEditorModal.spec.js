import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ObsControlScriptEditorModal from
    '../../../src/form-builder/components/ObsControlScriptEditorModal';
import sinon from 'sinon';
import CodeMirror from 'codemirror';

chai.use(chaiEnzyme());

describe('ObsControlScriptEditorModal', () => {
  let wrapper;
  let updateScriptSpy;
  let closeSpy;
  let codeMirrorStub;

  beforeEach(() => {
    updateScriptSpy = sinon.spy();
    closeSpy = sinon.spy();
  });

  afterEach(() => {
    if (codeMirrorStub) {
      codeMirrorStub.restore();
    }
  });

  it('should render obs control script editor modal', () => {
    const controlScript = '';
    const controlEventTitleId = '1';
    const controlEventTitleName = 'title';
    wrapper = mount(
      <ObsControlScriptEditorModal
        close={closeSpy}
        script={controlScript}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
        updateScript={updateScriptSpy}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(1);
    expect(wrapper.find('.control-modal .label-value').at(0).text()).to.eq(controlEventTitleId);
    expect(wrapper.find('.control-modal .label-value').at(1).text()).to.eq(controlEventTitleName);
    expect(wrapper.find('.control-modal .editor-wrapper').text()).to.eq('');
  });

  it('should not render any obs control script editor modal when title id is null', () => {
    const controlScript = '';
    wrapper = mount(
      <ObsControlScriptEditorModal
        close={closeSpy}
        script={controlScript}
        updateScript={updateScriptSpy}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(0);
    expect(wrapper.find('.control-modal .editor-wrapper')).to.have.length(0);
  });

  it('should render save event or form event control script editor modal', () => {
    const controlScript = '';
    const controlEventTitleId = null;
    const controlEventTitleName = 'title';
    wrapper = mount(
      <ObsControlScriptEditorModal
        close={closeSpy}
        script={controlScript}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
        updateScript={updateScriptSpy}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(1);
    expect(wrapper.find('.control-modal .label-value')).to.have.length(0);
  });

  it('should render save event or form event control script editor modal', () => {
    const controlScript = '';
    const controlEventTitleId = null;
    const controlEventTitleName = 'title';
    wrapper = mount(
      <ObsControlScriptEditorModal
        close={closeSpy}
        script={controlScript}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
        updateScript={updateScriptSpy}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(1);
    expect(wrapper.find('.control-modal .label-value')).to.have.length(0);
  });
});
