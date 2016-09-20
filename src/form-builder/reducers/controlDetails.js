const controlDetails = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: action.id });
    default:
      return store;
  }
};

export default controlDetails;
