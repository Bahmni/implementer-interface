import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import FormConditionsModal from 'form-builder/components/FormConditionsModal';
chai.use(chaiEnzyme());

describe('FormConditionsModal', () => {
  let wrapper;
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

  it('should call showObsControlScriptEditorModal twice with no observations ', () => {
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
    sinon.assert.calledTwice(wrapperInstance.showObsControlScriptEditorModal);
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event');
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event');

    expect(wrapper.find('ObsControlScriptEditorModal').length).to.eq(2);
  });

  it('should call showObsControlScriptEditorModal twice with observations which has no events'
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
      sinon.assert.callCount(wrapperInstance.showObsControlScriptEditorModal, 2);
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event');
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event');
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
      const dropDown = wrapper.find('.obs-dropdown');
      expect(dropDown.length).to.eq(0);
      sinon.assert.callCount(wrapperInstance.showObsControlScriptEditorModal, 3);
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Form Event', { current: null });
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
      undefined, null, 'Save Event', { current: null });
      sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
          'func1(){}', formControlEvents[0].id, formControlEvents[0].name, { current: null });
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

  it('should render save button', () => {
    wrapper = shallow(
      <FormConditionsModal
        close={() => {}}
        controlEvents={formControlEvents}
        formDetails={formDetails}
        formTitle={formTitle}
        script={script}
        updateScript={() => {}}
      />);
    expect(wrapper.find('.btn--highlight').length).to.eql(1);
    expect(wrapper.find('.btn--highlight').text()).to.eql('Save');
  });

  it('should render dropdown and control event editors according to control events passed', () => {
    formControlEvents = [{ id: '1', name: 'obs1', events: { onValueChange: 'func1(){}' } },
      { id: '2', name: 'obs2', events: undefined }];
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
    const dropDown = wrapper.find('.obs-dropdown option');
    expect(dropDown).to.have.lengthOf(2);
    sinon.assert.callCount(wrapperInstance.showObsControlScriptEditorModal, 3);
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
        undefined, null, 'Form Event', { current: null });
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
        undefined, null, 'Save Event', { current: null });
    sinon.assert.calledWith(wrapperInstance.showObsControlScriptEditorModal,
        'func1(){}', formControlEvents[0].id, formControlEvents[0].name, { current: null });
    expect(wrapper.find('ObsControlScriptEditorModal').length).to.eq(3);
  });

  it('should update state variables on dropdown selection', () => {
    formControlEvents = [{ id: '1', name: 'obs1', events: { onValueChange: 'func1(){}' } },
      { id: '2', name: 'obs2', events: undefined }];
    const value = '2';
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
    sinon.stub(wrapperInstance, 'updateDropDownSelection');
    wrapperInstance.render();

    const drop = wrapper.find('.obs-dropdown');
    drop.simulate('change', { target: { value } });
    expect(wrapper.state().controlsWithEvents).to.have.all.keys('1', '2');
    expect(wrapper.state().controlsWithoutEvents).to.be.empty;
  });
});
