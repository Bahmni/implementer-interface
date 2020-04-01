import { cloneDeep } from 'lodash';
const controlDetails = (store = {}, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case 'SELECT_CONTROL':
      let storeClone;
      if (store.allControls === undefined) {
        storeClone = Object.assign({}, store, { allControls: [{ id: action.metadata.id,
          name: action.metadata.concept.name, events: action.metadata.events }] });
      } else {
        storeClone = store;
        storeClone.allControls = storeClone.allControls.filter(control =>
          control.id !== action.metadata.id);
        storeClone.allControls = storeClone.allControls.concat({ id: action.metadata.id,
          name: action.metadata.concept.name, events: action.metadata.events });
      }
      return Object.assign({}, storeClone, { selectedControl: action.metadata });
    case 'DESELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: undefined });
    case 'FOCUS_CONTROL':
      return Object.assign({}, store, { focusedControl: action.id });
    case 'BLUR_CONTROL':
      return Object.assign({}, store, { focusedControl: undefined });
    case 'SOURCE_CHANGED':
      // eslint-disable-next-line no-param-reassign
      store.selectedControl.events = { onValueChange: action.source };
      // eslint-disable-next-line no-param-reassign
      store.allControls = store.allControls.map(control =>
        (control.id === action.id ?
          Object.assign({}, control, { events: { onValueChange: action.source } })
          : control)
      );
      return cloneDeep(store);
    case 'FORM_LOAD':
      return Object.assign({}, store, { allControls:
          action.controls.map(e => ({ id: e.id,
            name: e.concept.name, events: e.events })) });
    case 'DRAG_SOURCE_CHANGED':
      return Object.assign({}, store, { dragSourceCell: action.cell });

    default:
      return store;
  }
};

export default controlDetails;
