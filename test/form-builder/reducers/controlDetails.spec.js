import { expect } from 'chai';
import controlDetails from 'form-builder/reducers/controlDetails';

describe('controlDetails', () => {
  let action;
  let expectedStoreState;
  beforeEach(() => {
    action = {
      type: 'SELECT_CONTROL',
      id: '123',
    };
    expectedStoreState = { selectedControl: '123' };
  });

  it('should add selected control id to store', () => {
    const state = controlDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should update seletected control id', () => {
    const state = controlDetails({ selectedControl: '456' }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = controlDetails({ selectedControl: '123' }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = controlDetails(undefined, action);
    expect(state).to.be.eql({});
  });
});
