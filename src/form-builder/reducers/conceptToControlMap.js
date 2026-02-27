/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

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
