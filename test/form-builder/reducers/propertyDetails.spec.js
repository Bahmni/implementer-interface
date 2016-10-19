import { expect } from 'chai';
import propertyDetails from 'form-builder/reducers/propertyDetails';

describe('propertyDetails', () => {
  let action = {};
  let expectedStoreState;
  beforeEach(() => {
    const property = { mandatory: true };
    action = { id: '123', property, type: 'SET_CHANGED_PROPERTY' };
    expectedStoreState = { id: '123', property };
  });

  it('should add updated properties to store', () => {
    const state = propertyDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const store = { property: {} };
    const state = propertyDetails(store, action);
    expect(state).to.be.eql(store);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = propertyDetails(undefined, action);
    expect(state).to.be.eql({});
  });
});
