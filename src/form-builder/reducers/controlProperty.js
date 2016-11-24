const controlProperty = (store = {}, action) => {
  switch (action.type) {
    case 'SET_CHANGED_PROPERTY':
      return Object.assign({}, store, { id: action.id, property: action.property });
    case 'REMOVE_CONTROL_PROPERTIES':
      return {};
    default:
      return store;
  }
};

export default controlProperty;
