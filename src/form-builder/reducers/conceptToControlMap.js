const conceptToControlMap = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_SOURCE':
      return Object.assign({}, store, { [action.id]: action.concept });
    case 'REMOVE_SOURCE_MAP':
      return {};
    case 'ADD_SOURCE_MAP':
      return Object.assign({}, store, action.sourceMap);
    default:
      return store;
  }
};

export default conceptToControlMap;
