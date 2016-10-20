const controlProperty = (store = {}, action) => {
  switch (action.type) {
    case 'SET_CHANGED_PROPERTY':
      return Object.assign({}, store, { id: action.id, property: action.property });
    default:
      return store;
  }
};

export default controlProperty;
