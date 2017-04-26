import { expect } from 'chai';
import controlDetails from 'form-builder/reducers/controlDetails';

describe('controlDetails', () => {
  let action = {};
  let expectedStoreState;
  describe('selectControl', () => {
    beforeEach(() => {
      const metadata = {
        type: 'obsControl',
        concept: {
          uuid: 'someUuid',
          datatype: 'text',
        },
      };

      action = {
        type: 'SELECT_CONTROL',
        metadata,
      };
      expectedStoreState = { selectedControl: metadata };
    });

    it('should add selected control id to store', () => {
      const state = controlDetails({}, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update seletected control id', () => {
      const state = controlDetails({ selectedControl: '456' }, action);
      expect(state).to.be.eql(expectedStoreState);
    });
  });

  describe('deselectControl', () => {
    it('should deselect control', () => {
      action = { type: 'DESELECT_CONTROL' };
      const state = controlDetails({ selectedControl: '123' }, action);
      expect(state).to.be.eql({ selectedControl: undefined });
    });
  });

  it('should return store as is when action type does not match', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const store = { selectedControl: '123' };
    const state = controlDetails(store, action);
    expect(state).to.be.eql(store);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = controlDetails(undefined, action);
    expect(state).to.be.eql({});
  });

  describe('focusControl', () => {
    beforeEach(() => {
      action = {
        type: 'FOCUS_CONTROL',
        id: 10,
      };
      expectedStoreState = { focusedControl: 10 };
    });

    it('should add focused control id to store', () => {
      const state = controlDetails({}, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update seletected control id', () => {
      const state = controlDetails({ focusedControl: 12 }, action);
      expect(state).to.be.eql(expectedStoreState);
    });
  });

  describe('blurControl', () => {
    it('should blur control', () => {
      action = { type: 'BLUR_CONTROL' };
      const state = controlDetails({ focusedControl: 12 }, action);
      expect(state).to.be.eql({ focusedControl: undefined });
    });
  });

  describe('sourceChanged', () => {
    it('should change the source', () => {
      action = { type: 'SOURCE_CHANGED', source: 'test' };

      const state = controlDetails({ selectedControl: {} }, action);

      expect(state.selectedControl.events).to.eql({ onValueChange: 'test' });
    });
  });
});
