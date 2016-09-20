import { expect } from 'chai';
import conceptToControlMapper from 'form-builder/reducers/conceptToControlMapper';

describe('conceptToControlMapper', () => {
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
      123: {
        concept: action.concept,
      },
    };
    const state = conceptToControlMapper({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should add concept to control mapping for new concept', () => {
    const expectedStoreState = {
      456: {
        concept: {},
      },
      123: {
        concept: action.concept,
      },
    };
    const state = conceptToControlMapper({ 456: { concept: {} } }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    const expectedStoreState = {
      456: {
        concept: {},
      },
    };

    action.type = 'SOME_RANDOM_TYPE';

    const state = conceptToControlMapper({ 456: { concept: {} } }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = conceptToControlMapper(undefined, action);
    expect(state).to.be.eql({});
  });
});
