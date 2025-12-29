import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormEventEditorWithRedux, { FormEventEditor }
  from 'form-builder/components/FormEventEditor.jsx';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { getStore } from 'test/utils/storeHelper';
import { utf8ToBase64 } from 'common/utils/encodingUtils';

import {
  formEventUpdate,
  formLoad,
  saveEventUpdate,
  formConditionsEventUpdate,
  setChangedProperty, sourceChangedProperty,
} from 'form-builder/actions/control';

chai.use(chaiEnzyme());

describe('FormEventEditor', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  let closeEventEditorSpy;
  let updateScriptSpy;
  const formDetails = {};
  const property = {};
  const formControlEvents = {};

  beforeEach(() => {
    closeEventEditorSpy = sinon.spy();
    updateScriptSpy = sinon.spy();
    wrapper = shallow(
      <FormEventEditor
        children={<DummyComponent />}
        closeEventEditor={closeEventEditorSpy}
        formControlEvents={formControlEvents}
        formDetails={formDetails}
        property={property}
        updateScript={updateScriptSpy}
      />);
  });

  it('should render with passed child and properties', () => {
    expect(wrapper.find(DummyComponent).prop('formControlEvents')).to.eq(formControlEvents);
    expect(wrapper.find(DummyComponent).prop('formDetails')).to.eq(formDetails);
    expect(wrapper.find(DummyComponent).prop('property')).to.eq(property);
  });

  it('should invoke updatescript prop when child invoke updateScript', () => {
    const dummyScript = 'func abcd(){}';
    wrapper.find(DummyComponent).prop('updateScript')(dummyScript);
    sinon.assert.calledOnce(updateScriptSpy);
    sinon.assert.calledWith(updateScriptSpy, dummyScript,
      wrapper.find(DummyComponent).prop('property'));
  });
});


describe('FormEventEditorWithRedux_where_formSaveEvent_is_true', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  let property;
  let state;
  let store;

  beforeEach(() => {
    property = { formSaveEvent: true };
    state = { controlProperty: { property }, formDetails, controlDetails: {} };
    store = getStore(state);
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });

  it('should update formInitEvent, formSaveEvent, formConditionsEvent property ' +
    'when closeEventEditor is called', () => {
    const controlId = 1;
    wrapper.find('FormEventEditor').prop('closeEventEditor')(controlId);
    sinon.assert.callCount(store.dispatch, 4);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ formInitEvent: false })));
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ formSaveEvent: false })));
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ formConditionsEvent: false })));
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ controlEvent: false }, controlId)));
  });

  it('should update saveEventUpdate property when updateScript is called ' +
    'and formSaveEvent is true', () => {
    const script = 'abcd';
    const encodedScript = utf8ToBase64(script);
    wrapper.find('FormEventEditor').prop('updateScript')(script, property);
    sinon.assert.calledOnce(store.dispatch);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(saveEventUpdate(encodedScript)));
  });
});


describe('FormEventEditorWithRedux_where_formSaveEvent_is_false', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  const property = { formSaveEvent: false };
  const state = { controlProperty: { property }, formDetails, controlDetails: {} };
  const store = getStore(state);

  beforeEach(() => {
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });

  it('should update saveEventUpdate property when updateScript ' +
    'is called and formSaveEvent is false', () => {
    const script = 'abcd';
    wrapper.find('FormEventEditor').prop('updateScript')(script, property);
    sinon.assert.callCount(store.dispatch, 0);
  });
});

describe('FormEventEditorWithRedux_where_formConditionsEvent_is_true', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  let property;
  let state;
  let store;

  beforeEach(() => {
    property = { formConditionsEvent: true };
    state = { controlProperty: { property }, formDetails, controlDetails: {} };
    store = getStore(state);
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });
  it('should update formConditionsEvent property when updateScript is called ' +
    'and formConditionsEvent is true', () => {
    const script = 'abcd';
    const encodedScript = utf8ToBase64(script);
    wrapper.find('FormEventEditor').prop('updateScript')(script, property);
    sinon.assert.calledOnce(store.dispatch);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(formConditionsEventUpdate(encodedScript)));
  });
});

describe('FormEventEditorWithRedux_where_formConditionsEvent_is_false', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  const property = { formConditionsEvent: false };
  const state = { controlProperty: { property }, formDetails, controlDetails: {} };
  const store = getStore(state);

  beforeEach(() => {
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });

  it('should update formConditionsEvent property when updateScript ' +
    'is called and formConditionsEvent is false', () => {
    const script = 'abcd';
    wrapper.find('FormEventEditor').prop('updateScript')(script, property);
    sinon.assert.callCount(store.dispatch, 0);
  });
});

describe('Update All Scripts', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  let store;

  beforeEach(() => {
    store = getStore();
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });

  it('should save all control scripts in redux', () => {
    wrapper.find('FormEventEditor').prop('updateAllScripts')({ controlScripts: [] });
    sinon.assert.calledOnce(store.dispatch.withArgs(formLoad([])));
  });

  it('should save form save event in redux', () => {
    wrapper.find('FormEventEditor').prop('updateAllScripts')({ formSaveEventScript: 'Save Event' });
    sinon.assert.calledOnce(store.dispatch.withArgs(saveEventUpdate(utf8ToBase64('Save Event'))));
  });

  it('should save form init event in redux', () => {
    wrapper.find('FormEventEditor').prop('updateAllScripts')({ formInitEventScript: 'Init Event' });
    sinon.assert.calledOnce(store.dispatch.withArgs(formEventUpdate(utf8ToBase64('Init Event'))));
  });

  it('should save control events, form save event and form init event in redux', () => {
    wrapper.find('FormEventEditor').prop('updateAllScripts')({
      controlScripts: [],
      formSaveEventScript: 'Save Event',
      formInitEventScript: 'Init Event',
    });
    sinon.assert.callCount(store.dispatch, 4);
    sinon.assert.calledOnce(store.dispatch.withArgs(formLoad([])));
    sinon.assert.calledOnce(store.dispatch.withArgs(saveEventUpdate(utf8ToBase64('Save Event'))));
    sinon.assert.calledOnce(store.dispatch.withArgs(formEventUpdate(utf8ToBase64('Init Event'))));
  });

  it('should dispatch all actions even when form init and save script are empty', () => {
    wrapper.find('FormEventEditor').prop('updateAllScripts')({
      controlScripts: [],
      formSaveEventScript: '',
      formInitEventScript: '',
    });
    sinon.assert.callCount(store.dispatch, 4);
    sinon.assert.calledOnce(store.dispatch.withArgs(formLoad([])));
    sinon.assert.calledOnce(store.dispatch.withArgs(saveEventUpdate('')));
    sinon.assert.calledOnce(store.dispatch.withArgs(formEventUpdate('')));
  });
});

describe('FormEventEditorWithRedux_where_controlEvent_is_true', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  let property;
  let state;
  let store;

  beforeEach(() => {
    property = { controlEvent: true, selectedControlId: '123' };
    state = { controlProperty: { property }, formDetails, controlDetails: {} };
    store = getStore(state);
    wrapper = shallow(
      <FormEventEditorWithRedux
        children={<DummyComponent />}
        store = {store}
      />);
  });
  it('should update sourceChangedProperty when updateScript is called ' +
    'with controlEvent is true', () => {
    const script = 'abcd';
    wrapper.find('FormEventEditor').prop('updateScript')(script, property, '123');
    sinon.assert.calledOnce(store.dispatch);
    sinon.assert.calledOnce(store.dispatch.withArgs(sourceChangedProperty(script, '123')));
  });
});
