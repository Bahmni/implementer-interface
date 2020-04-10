import React from 'react';
import { mount } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ObsControlScriptEditorModal from
    '../../../src/form-builder/components/ObsControlScriptEditorModal';
import sinon from 'sinon';

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
});
