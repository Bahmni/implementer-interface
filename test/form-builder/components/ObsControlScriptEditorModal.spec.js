import React from 'react';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import ObsControlScriptEditorModal from
    '../../../src/form-builder/components/ObsControlScriptEditorModal';
import sinon from 'sinon';

chai.use(chaiEnzyme());

describe('ObsControlScriptEditorModal', () => {
  let wrapper;
  let codeMirrorStub;
  const controlScript = '';
  const controlEventTitleId = '1';
  const controlEventTitleName = 'title';
  const removeControlEventSpy = sinon.spy();

  afterEach(() => {
    if (codeMirrorStub) {
      codeMirrorStub.restore();
    }
  });

  it('should not render anything if no title id is given', () => {
    wrapper = mount(
        <ObsControlScriptEditorModal
          script={controlScript}
          titleId={undefined}
          titleName={controlEventTitleName}
        />);
    // eslint-disable-next-line no-unused-expressions
    expect(wrapper).to.be.empty;
  });

  it('should render obs control script editor modal', () => {
    wrapper = mount(
      <ObsControlScriptEditorModal
        script={controlScript}
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
});
