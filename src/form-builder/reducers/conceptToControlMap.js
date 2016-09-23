const conceptToControlMap = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_SOURCE':
      return Object.assign({}, store, { [action.id]: action.concept });
    default:
      return store;
  }
};

export default conceptToControlMap;
