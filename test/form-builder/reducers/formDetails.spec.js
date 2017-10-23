import { expect } from 'chai';
import formDetails from 'form-builder/reducers/formDetails';

describe('formDetails', () => {
  it('should store default locale', () => {
    const action = { locale: 'en', type: 'SET_DEFAULT_LOCALE' };
    const expectedStoreState = { defaultLocale: 'en' };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed events', () => {
    const action = { events: {}, type: 'EVENT_CHANGED' };
    const expectedStoreState = { events: { onFormInit: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });
});
