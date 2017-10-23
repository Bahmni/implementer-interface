
const formDetails = (store = {}, action) => {
  switch (action.type) {
    case 'EVENT_CHANGED':
      return Object.assign({}, store, { events: { onFormInit: action.events } });
    case 'SET_DEFAULT_LOCALE':
      return Object.assign({}, store, { defaultLocale: action.locale });
    default:
      return store;
  }
};

export default formDetails;
