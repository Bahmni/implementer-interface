const conceptToControlMapper = (store = {}, action) => {
  switch (action.type) {
    case 'SELECT_SOURCE':
      return Object.assign({}, store, { [action.id]: { concept: action.concept } });
    default:
      return store;
  }
};

export default conceptToControlMapper;
