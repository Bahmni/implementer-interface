
const formDetails = (store = {}, action) => {
  switch (action.type) {
    case 'EVENT_CHANGED':
      return Object.assign({}, store, {events: {onFormInit: action.events}});
    default:
      return store;
  }
};

export default formDetails;