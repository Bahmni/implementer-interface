import { expect } from 'chai';
import controlDetails from 'form-builder/reducers/controlDetails';

describe('controlDetails', () => {
  let action = {};
  let metadata = {};
  let expectedStoreState;
  let allObsControlEvents;
  describe('selectControl', () => {
    beforeEach(() => {
      metadata = {
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
      allObsControlEvents = [{ id: action.metadata.id,
        name: action.metadata.concept !== undefined ? action.metadata.concept.name : undefined,
        events: action.metadata.events }];
      expectedStoreState = { allObsControlEvents, selectedControl: metadata };
    });

    it('should add selected control id to store and add to all controls', () => {
      const state = controlDetails({ allObsControlEvents }, action);
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

  describe('selectControl_metada_without_concept', () => {
    beforeEach(() => {
      metadata = {
        type: 'obsControl',
        id: 1,
        events: {
          onValueChange: 'func(){}',
        },
      };

      action = {
        type: 'SELECT_CONTROL',
        metadata,
      };
      allObsControlEvents = [{ id: action.metadata.id,
        name: undefined,
        events: action.metadata.events }];
      expectedStoreState = { allObsControlEvents, selectedControl: metadata };
    });

    it('should add selected control id to store and assign all controls ' +
      'when allObsControlEvents are {}', () => {
      const state = controlDetails({}, action);
      expect(state).to.be.eql({ allObsControlEvents: [], selectedControl: metadata });
    });

    it('should add selected control id to store and assign all controls ' +
      'when allObsControlEvents are not empty', () => {
      const state = controlDetails({ allObsControlEvents }, action);
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
      allObsControlEvents = [{ id: 1, name: 'ob1', events: { onValueChange: '' } },
        { id: 2, name: 'ob2', events: { onValueChange: '' } }];

      const state = controlDetails({ allObsControlEvents, selectedControl: {} }, action);

      expect(state.selectedControl.events).to.eql({ onValueChange: 'test' });
      const updatedControl = state.allObsControlEvents.filter(e => e.id === action.id);
      expect(updatedControl[0].events).to.eql({ onValueChange: 'test' });
    });
  });

  describe('formLoad', () => {
    it('should assign all controls on form load', () => {
      const controls = [{
        id: 1,
        name: 'controlName',
        events: {
          onValueChange: 'func(){}',
        },
      }];
      action = {
        type: 'FORM_LOAD',
        controls,
      };
      const state = controlDetails({}, action);
      expect(state).to.be.eql({ allObsControlEvents: controls });
    });
  });

  describe('deleteControl', () => {
    beforeEach(() => {
      const controls = [{
        id: 1,
        name: 'controlName',
        events: {
          onValueChange: 'func(){}',
        },
      }];
      action = {
        type: 'DELETE_CONTROL',
        controlIds: [controls[0].id],
      };
      allObsControlEvents = [{ id: controls[0].id,
        name: controls[0].name,
        events: controls[0].events }];
      expectedStoreState = { allObsControlEvents };
    });

    it('should delete selected control on delete control', () => {
      const state = controlDetails({ allObsControlEvents }, action);
      expect(state).to.be.eql({ allObsControlEvents: [] });
    });
  });
});
