const controlDetails = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: action.id });
    case 'DESELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: undefined });
    default:
      return store;
  }
};

export default controlDetails;
