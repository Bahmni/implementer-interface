const formDetails = (store = {}, action) => {
  switch (action.type) {
    case 'FORM_EVENT_CHANGED':
      return Object.assign({}, store, {
        events: Object.assign({}, store.events,
          { onFormInit: action.events }),
      });
    case 'SAVE_EVENT_CHANGED':
      return Object.assign({}, store, {
        events: Object.assign({}, store.events,
          { onFormSave: action.events }),
      });
    case 'SET_DEFAULT_LOCALE':
      return Object.assign({}, store, { defaultLocale: action.locale });
    default:
      return store;
  }
};

export default formDetails;
