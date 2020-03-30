import { expect } from 'chai';
import formDetails from 'form-builder/reducers/formDetails';

describe('formDetails', () => {
  it('should store default locale', () => {
    const action = { locale: 'en', type: 'SET_DEFAULT_LOCALE' };
    const expectedStoreState = { defaultLocale: 'en' };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed form events', () => {
    const action = { events: {}, type: 'FORM_EVENT_CHANGED' };
    const expectedStoreState = { events: { onFormInit: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed form save events', () => {
    const action = { events: {}, type: 'SAVE_EVENT_CHANGED' };
    const expectedStoreState = { events: { onFormSave: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return empty store when no type is passed', () => {
    const action = { events: {}, type: '' };
    const expectedStoreState = { events: { } };
    const state = formDetails({ events: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });
});
