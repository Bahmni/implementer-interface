const formPrivileges = (store = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PRIVILEGES':
      return Object.assign({}, store, {
        privileges: Object.assign({}, store.privileges,
              { onFormSave: action.privileges }),
      });
    default:
      return store;
  }
};

export default formPrivileges;
