const conceptToControlMap = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_SOURCE':
      return Object.assign({}, store, { [action.id]: action.concept });
    case 'REMOVE_SOURCE_MAP':
      return {};
    default:
      return store;
  }
};

export default conceptToControlMap;
