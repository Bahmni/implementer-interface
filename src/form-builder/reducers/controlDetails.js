import { cloneDeep } from 'lodash';
const controlDetails = (store = {}, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case 'SELECT_CONTROL':
      let storeClone;
      if (store.allObsControlEvents === undefined) {
        storeClone = Object.assign({}, store, { allObsControlEvents: [{ id: action.metadata.id,
          name: action.metadata.concept.name, events: action.metadata.events }] });
      } else {
        storeClone = store;
        storeClone.allObsControlEvents = storeClone.allObsControlEvents.filter(control =>
          control.id !== action.metadata.id);
        storeClone.allObsControlEvents = storeClone.allObsControlEvents.concat(
          { id: action.metadata.id,
            name: action.metadata.concept !== undefined ? action.metadata.concept.name : undefined,
            events: action.metadata.events });
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
      store.allObsControlEvents = store.allObsControlEvents.map(control =>
        (control.id === action.id ?
          Object.assign({}, control, { events: { onValueChange: action.source } })
          : control)
      );
      return cloneDeep(store);
    case 'FORM_LOAD':
      return Object.assign({}, store, { allObsControlEvents:
          action.controls.map(e => ({ id: e.id,
            name: e.concept !== undefined ? e.concept.name : undefined, events: e.events })) });
    case 'DRAG_SOURCE_CHANGED':
      return Object.assign({}, store, { dragSourceCell: action.cell });

    default:
      return store;
  }
};

export default controlDetails;
