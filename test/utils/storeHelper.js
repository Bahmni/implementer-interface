/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import sinon from 'sinon';

const defaultState = {
  controlDetails: {},
};

export function getStore(state = defaultState) {
  return {
    subscribe: sinon.spy().named('subscribe'),
    dispatch: sinon.spy().named('dispatch'),
    getState: sinon.spy(() => state).named('getState'),
  };
}
