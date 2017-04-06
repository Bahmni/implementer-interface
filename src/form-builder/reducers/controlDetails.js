import {cloneDeep} from "lodash";

const controlDetails = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: action.metadata });
    case 'DESELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: undefined });
    case 'FOCUS_CONTROL':
      return Object.assign({}, store, { focusedControl: action.id });
    case 'BLUR_CONTROL':
      return Object.assign({}, store, { focusedControl: undefined });
    case 'SOURCE_CHANGED':
      store.selectedControl.events.onValueChange = action.source;
      return cloneDeep(store);
    default:
      return store;
  }
};

export default controlDetails;
