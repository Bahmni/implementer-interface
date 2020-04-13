import React from 'react';
import chaiEnzyme from 'chai-enzyme';
import chai, { expect } from 'chai';
import FormEventEditorWithRedux, { FormEventEditor }
from 'form-builder/components/FormEventEditor.jsx';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { getStore } from 'test/utils/storeHelper';

import { formEventUpdate, saveEventUpdate, setChangedProperty } from 'form-builder/actions/control';

chai.use(chaiEnzyme());

describe('FormEventEditor', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  let closeEventEditorSpy;
  let updateScriptSpy;
  const formDetails = {};
  const property = {};

  beforeEach(() => {
    closeEventEditorSpy = sinon.spy();
    updateScriptSpy = sinon.spy();
    wrapper = shallow(
      <FormEventEditor
        children={<DummyComponent />}
        closeEventEditor={closeEventEditorSpy}
        formDetails={formDetails}
        property={property}
        updateScript={updateScriptSpy}
      />);
  });

  it('should render with passed child and properties', () => {
    expect(wrapper.find(DummyComponent).prop('formDetails')).to.eq(formDetails);
    expect(wrapper.find(DummyComponent).prop('property')).to.eq(property);
    expect(wrapper.find(DummyComponent).prop('closeEventEditor')).to.eq(closeEventEditorSpy);
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
    state = { controlProperty: { property }, formDetails };
    store = getStore(state);
    wrapper = shallow(
        <FormEventEditorWithRedux
          children={<DummyComponent />}
          store = {store}
        />);
  });

  it('should update formInitEvent, formSaveEvent property when closeEventEditor is called', () => {
    wrapper.find('FormEventEditor').prop('closeEventEditor')();
    sinon.assert.calledTwice(store.dispatch);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ formInitEvent: false })));
    sinon.assert.calledOnce(store.dispatch
      .withArgs(setChangedProperty({ formSaveEvent: false })));
  });

  it('should update saveEventUpdate property when updateScript is called ' +
    'and formSaveEvent is true', () => {
    const script = 'abcd';
    wrapper.find('FormEventEditor').prop('updateScript')(script, property);
    sinon.assert.calledOnce(store.dispatch);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(saveEventUpdate(script)));
  });
});


describe('FormEventEditorWithRedux_where_formSaveEvent_is_false', () => {
  let wrapper;
  const DummyComponent = () => <div></div>;
  const formDetails = {};
  const property = { formSaveEvent: false };
  const state = { controlProperty: { property }, formDetails };
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
    sinon.assert.calledOnce(store.dispatch);
    sinon.assert.calledOnce(store.dispatch
      .withArgs(formEventUpdate(script)));
  });
});

