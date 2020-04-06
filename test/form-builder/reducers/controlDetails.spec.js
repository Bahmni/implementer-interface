import { expect } from 'chai';
import controlDetails from 'form-builder/reducers/controlDetails';

describe('controlDetails', () => {
  let action = {};
  let expectedStoreState;
  let allControls;
  describe('selectControl', () => {
    beforeEach(() => {
      const metadata = {
        type: 'obsControl',
        concept: {
          uuid: 'someUuid',
          datatype: 'text',
          name: 'controlName',
        },
        id: 1,
        events: {
          onValueChange: 'func(){}',
        },
      };

      action = {
        type: 'SELECT_CONTROL',
        metadata,
      };
      allControls = [{ id: action.metadata.id,
        name: action.metadata.concept !== undefined ? action.metadata.concept.name : undefined,
        events: action.metadata.events }];
      expectedStoreState = { allControls, selectedControl: metadata };
    });

    it('should add selected control id to store and add to all controls', () => {
      const state = controlDetails({ allControls }, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should add selected control id to store and assign all controls', () => {
      const state = controlDetails({}, action);
      expect(state).to.be.eql(expectedStoreState);
    });

    it('should update selected control id', () => {
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
      action = { type: 'SOURCE_CHANGED', source: 'test', id: 1 };
      allControls = [{ id: 1, name: 'ob1', events: { onValueChange: '' } }];

      const state = controlDetails({ allControls, selectedControl: {} }, action);

      expect(state.selectedControl.events).to.eql({ onValueChange: 'test' });
      const updatedControl = state.allControls.filter(e => e.id === action.id);
      expect(updatedControl[0].events).to.eql({ onValueChange: 'test' });
    });
  });

  describe('formLoad', () => {
    it('should assign all controls on form load', () => {
      const controls = [{
        type: 'obsControl',
        concept: {
          uuid: 'someUuid',
          datatype: 'text',
          name: 'controlName',
        },
        id: 1,
        events: {
          onValueChange: 'func(){}',
        },
      }];
      action = {
        type: 'FORM_LOAD',
        controls,
      };
      const state = controlDetails({}, action);
      // eslint-disable-next-line no-shadow
      const allControls = [{
        id: controls[0].id,
        name: controls[0].concept.name,
        events: controls[0].events,
      }];
      expect(state).to.be.eql({ allControls });
    });
  });
});
