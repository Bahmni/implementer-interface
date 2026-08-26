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
    case 'FORM_CONDITIONS_CHANGED':
      return Object.assign({}, store, {
        events: Object.assign({}, store.events,
          { onFormConditionsUpdate: action.events }),
      });
    case 'FORM_PRIVILEGES_CHANGED':
      return Object.assign({}, store, {
        events: Object.assign({}, store.events,
                { onFormPrivilegesUpdate: action.events }),
      });
    case 'SET_DEFAULT_LOCALE':
      return Object.assign({}, store, { defaultLocale: action.locale });
    case 'FORM_DEFINITION_VERSION_UPDATE':
      return Object.assign({}, store, { formDefVersion: action.version });
    case 'SET_ALLOWED_DOMAINS':
      return Object.assign({}, store, { allowedDomains: action.domains });
    default:
      return store;
  }
};

export default formDetails;
