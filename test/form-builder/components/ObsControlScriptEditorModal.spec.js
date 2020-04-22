import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ObsControlScriptEditorModal from
    '../../../src/form-builder/components/ObsControlScriptEditorModal';
import sinon from 'sinon';
import CodeMirror from 'codemirror';
import jsBeautifier from 'js-beautify';

chai.use(chaiEnzyme());

describe('ObsControlScriptEditorModal', () => {
  let wrapper;
  let codeMirrorStub;
  let beautifierStub;
  const controlScript = '';
  const controlEventTitleId = '1';
  const controlEventTitleName = 'title';
  const removeControlEventSpy = sinon.spy();

  afterEach(() => {
    if (codeMirrorStub) {
      codeMirrorStub.restore();
    }
    if (beautifierStub) {
      beautifierStub.restore();
    }
  });

  it('should render codemirror editor formatted data if text area ref is not empty', () => {
    codeMirrorStub = sinon.stub(CodeMirror, 'fromTextArea')
      .callsFake(() => ({ getValue() {return controlScript;}, setValue() {}, save() {},
        on() {} }));
    beautifierStub = sinon.stub(jsBeautifier, 'js_beautify').callsFake(() => '');
    wrapper = mount(
      <ObsControlScriptEditorModal
        removeControlEvent={removeControlEventSpy}
        script={controlScript}
        textAreaRef={{ current: 'values' }}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
      />);
    sinon.assert.calledOnce(codeMirrorStub);
    sinon.assert.calledOnce(beautifierStub);
  });

  it('should render obs control script editor modal', () => {
    wrapper = mount(
      <ObsControlScriptEditorModal
        script={controlScript}
        textAreaRef={undefined}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(1);
    expect(wrapper.find('.control-modal .label-value').at(0).text()).to.eq(controlEventTitleId);
    expect(wrapper.find('.control-modal .label-value').at(1).text()).to.eq(controlEventTitleName);
    expect(wrapper.find('.control-modal .editor-wrapper').text()).to.eq('');
  });

  it('should not render obs control label when title id is null' +
    'when controlEventTitleId is null', () => {
    wrapper = mount(
      <ObsControlScriptEditorModal
        script={controlScript}
        textAreaRef={undefined}
        titleId={null}
        titleName={controlEventTitleName}
      />);
    expect(wrapper.find('.control-modal')).to.have.length(1);
    expect(wrapper.find('.control-modal .label-value')).to.have.length(0);
  });

  it('should have delete icon and click on it should open confirmation popup', () => {
    wrapper = shallow(
        <ObsControlScriptEditorModal
          removeControlEvent = {removeControlEventSpy}
          script={controlScript}
          textAreaRef={undefined}
          titleId={controlEventTitleId}
          titleName={controlEventTitleName}
        />);
    const closeIcon = wrapper.find('.fa-times').at(0);
    expect(wrapper.state().displayConfirmationPopup).to.eq(false);
    expect(wrapper.find('Popup').dive().find('RemoveControlEventConfirmation').exists())
        .to.eq(false);
    closeIcon.simulate('click');
    expect(wrapper.state().displayConfirmationPopup).to.eq(true);
    expect(wrapper.find('Popup').dive().find('RemoveControlEventConfirmation').exists())
        .to.eq(true);
  });

  it('should render error-editor when there is an error in script', () => {
    wrapper = shallow(
      <ObsControlScriptEditorModal
        hasError
        removeControlEvent = {removeControlEventSpy}
        script={controlScript}
        textAreaRef={undefined}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
      />);

    expect(wrapper.find('.error-editor').length).to.eq(1);
  });

  it('should not render error-editor when there is no error in script', () => {
    wrapper = shallow(
      <ObsControlScriptEditorModal
        hasError={false}
        removeControlEvent = {removeControlEventSpy}
        script={controlScript}
        textAreaRef={undefined}
        titleId={controlEventTitleId}
        titleName={controlEventTitleName}
      />);

    expect(wrapper.find('.error-editor').length).to.eq(0);
  });

  it('should have format icon and click on it should open beautify the content', () => {
    beautifierStub = sinon.stub(jsBeautifier, 'js_beautify').callsFake(() => '');
    codeMirrorStub = sinon.stub(CodeMirror, 'fromTextArea')
        .callsFake(() => ({ getValue() {return controlScript;}, setValue() {}, save() {},
          on() {} }));
    wrapper = mount(
        <ObsControlScriptEditorModal
          removeControlEvent = {removeControlEventSpy}
          script={controlScript}
          textAreaRef={{ current: 'values' }}
          titleId={controlEventTitleId}
          titleName={controlEventTitleName}
        />);
    const formatIcon = wrapper.find('.fa-file-code-o');
    formatIcon.simulate('click');
    sinon.assert.calledOnce(codeMirrorStub);
    sinon.assert.calledTwice(beautifierStub);
  });
});
