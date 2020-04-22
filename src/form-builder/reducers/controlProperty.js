const controlProperty = (store = {}, action) => {
  switch (action.type) {
    case 'SET_CHANGED_PROPERTY':
      return Object.assign({}, store, { id: action.id, property: action.property });
    case 'REMOVE_CONTROL_PROPERTIES': {
      const formConditionsEvent = store.property && store.property.formConditionsEvent;
      return Object.assign({}, store, {
        id: undefined, property:
          { controlEvent: false, formConditionsEvent },
      });
    }
    default:
      return store;
  }
};

export default controlProperty;
