import { expect } from 'chai';
import controlProperty from 'form-builder/reducers/controlProperty';

describe('propertyDetails', () => {
  let action = {};
  let expectedStoreState;
  beforeEach(() => {
    const property = { mandatory: true };
    action = { id: '123', property, type: 'SET_CHANGED_PROPERTY' };
    expectedStoreState = { id: '123', property };
  });

  it('should add updated properties to store', () => {
    const state = controlProperty({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const store = { property: {} };
    const state = controlProperty(store, action);
    expect(state).to.be.eql(store);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = controlProperty(undefined, action);
    expect(state).to.be.eql({});
  });

  it('should return empty object when REMOVE_CONTROL_PROPERTIES be triggered', () => {
    action.type = 'REMOVE_CONTROL_PROPERTIES';
    const state = controlProperty(undefined, action);
    expect(state.id).to.be.eql(undefined);
    expect(state.property).to.be.eql({ controlEvent: false, formConditionsEvent: undefined });
  });
});
