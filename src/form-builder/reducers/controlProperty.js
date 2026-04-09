/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
