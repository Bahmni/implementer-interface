import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FormConditionsModal from 'form-builder/components/FormConditionsModal';
chai.use(chaiEnzyme());

describe('FormConditionsModal', () => {
  let wrapper;
  // eslint-disable-next-line no-unused-vars
  let ObsControlScriptEditorModalStub;
  let closeSpy;
  let formControlEvents = [];
  const formDetails = {};
  const formTitle = 'form title';
  const script = 'function(){}';

  it('should render with passed title prop', () => {
    wrapper = shallow(
      <FormConditionsModal
        close={() => {}}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
    expect(wrapper.find('.header-title').at(0).text()).to.eql(`${formTitle} - Form Conditions`);
  });

  it('should call showObsControlScriptEditorModal thrice with no observations ', () => {
    wrapper = shallow(
      <FormConditionsModal
        close={() => {}}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
    const wrapperInstance = wrapper.instance();
    sinon.stub(wrapperInstance, 'showObsControlScriptEditorModal');
    wrapperInstance.render();
    sinon.assert.calledThrice(wrapperInstance.showObsControlScriptEditorModal);
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event');
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event');
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined,undefined, undefined);

    expect(wrapper.find('ObsControlScriptEditorModal').length).to.eq(2);
  });

  it('should call showObsControlScriptEditorModal thrice with observations which has no events'
    , () => {
      formControlEvents = [{ id: '1', name: 'obs1' }];
      wrapper = shallow(
      <FormConditionsModal
        close={() => {}}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
      const wrapperInstance = wrapper.instance();
      sinon.stub(wrapperInstance, 'showObsControlScriptEditorModal');
      wrapperInstance.render();
      sinon.assert.callCount(wrapperInstance.showObsControlScriptEditorModal, 3);
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event');
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event');
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, undefined, undefined);
      expect(wrapper.find('ObsControlScriptEditorModal').length).to.eq(2);
    });

  it('should call showObsControlScriptEditorModal thrice with  observations which has events',
    () => {
      formControlEvents = [{ id: '1', name: 'obs1', events: { onValueChange: 'func1(){}' } }];
      wrapper = shallow(
      <FormConditionsModal
        close={() => {}}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
      const wrapperInstance = wrapper.instance();
      sinon.stub(wrapperInstance, 'showObsControlScriptEditorModal');
      wrapperInstance.render();
      sinon.assert.callCount(wrapperInstance.showObsControlScriptEditorModal, 4);
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event');
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event');
      // sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      //  formControlEvents[0].events, formControlEvents[0].id, formControlEvents[0].name);
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, undefined, undefined);
      expect(wrapper.find('ObsControlScriptEditorModal').length).to.eq(3);
    });

  it('should call closeSpy on click of format', () => {
    closeSpy = sinon.spy();
    wrapper = shallow(
      <FormConditionsModal
        close={closeSpy}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
    const saveButton = wrapper.find('.btn').at(0);
    saveButton.simulate('click');
    sinon.assert.calledOnce(closeSpy);
  });

  it.skip('should rerender ObsControlScriptEditorModal on change  of obs dropdown', () => {
    closeSpy = sinon.spy();
    formControlEvents = [{ id: '1', name: 'obs1' }];
    wrapper = shallow(
      <FormConditionsModal
        close={closeSpy}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
    wrapper.find('.obs-dropdown').simulate('change', { target: { value: '1' } });
    expect(wrapper.state('selectedControlEventTitleId')).to.eq(formControlEvents[0].id);
    expect(wrapper.state('selectedControlEventTitleName')).to.eq(formControlEvents[0].name);
  });
});
