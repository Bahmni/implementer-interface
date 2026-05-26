/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { cloneDeep } from 'lodash';
import formHelper from '../helpers/formHelper';

const controlDetails = (store = {}, action) => {
  switch (action.type) {
    // eslint-disable-next-line no-case-declarations
    case 'SELECT_CONTROL':
      let storeClone = cloneDeep(store);
      if (action.isConceptMapEvent) {
        const obsControlEvents = formHelper.getObsControlEvents(action.metadata);
        if (store.allObsControlEvents === undefined) {
          storeClone.allObsControlEvents = obsControlEvents;
        } else {
          const obsControlEventIds = obsControlEvents.map(a => a.id);
          storeClone.allObsControlEvents = storeClone.allObsControlEvents.filter(control =>
            !obsControlEventIds.includes(control.id));
          storeClone.allObsControlEvents = storeClone.allObsControlEvents.concat(obsControlEvents);
        }
      }
      return Object.assign({}, storeClone, { selectedControl: action.metadata });
    case 'DESELECT_CONTROL':
      return Object.assign({}, store, { selectedControl: undefined });
    case 'FOCUS_CONTROL':
      return Object.assign({}, store, { focusedControl: action.id });
    case 'BLUR_CONTROL':
      return Object.assign({}, store, { focusedControl: undefined });
    case 'SOURCE_CHANGED': {
      const eventData = action.source === '' ? undefined : { onValueChange: action.source };
      // eslint-disable-next-line no-param-reassign
      store.selectedControl.events = eventData;
      // eslint-disable-next-line no-param-reassign
      store.allObsControlEvents = store.allObsControlEvents.map(control =>
        (control.id === action.id ?
          Object.assign({}, control, { events: eventData })
          : control)
      );
      return cloneDeep(store);
    }
    case 'FORM_LOAD':
      return Object.assign({}, store, { allObsControlEvents: action.controls });

    case 'DELETE_CONTROL':
      storeClone = cloneDeep(store);
      storeClone.allObsControlEvents = storeClone.allObsControlEvents.filter(control =>
        !action.controlIds.includes(control.id));
      return storeClone;

    case 'DRAG_SOURCE_CHANGED':
      return Object.assign({}, store, { dragSourceCell: action.cell });

    default:
      return store;
  }
};

export default controlDetails;
