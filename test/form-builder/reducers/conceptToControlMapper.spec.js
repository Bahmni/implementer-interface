import { expect } from 'chai';
import conceptToControlMap from 'form-builder/reducers/conceptToControlMap';

describe('conceptToControlMap', () => {
  let action;
  beforeEach(() => {
    action = {
      type: 'SELECT_SOURCE',
      concept: {
        name: 'temperature',
        uuid: 'someUuid',
        type: 'text',
      },
      id: '123',
    };
  });

  it('should add concept to control mapping for a control', () => {
    const expectedStoreState = {
      123: action.concept,
    };
    const state = conceptToControlMap({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should add concept to control mapping for new concept', () => {
    const expectedStoreState = {
      456: {},
      123: action.concept,
    };
    const state = conceptToControlMap({ 456: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    const expectedStoreState = {
      456: {},
    };

    action.type = 'SOME_RANDOM_TYPE';

    const state = conceptToControlMap({ 456: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = conceptToControlMap(undefined, action);
    expect(state).to.be.eql({});
  });
});
