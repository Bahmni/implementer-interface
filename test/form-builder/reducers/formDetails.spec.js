/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import formDetails from 'form-builder/reducers/formDetails';

describe('formDetails', () => {
  it('should store default locale', () => {
    const action = { locale: 'en', type: 'SET_DEFAULT_LOCALE' };
    const expectedStoreState = { defaultLocale: 'en' };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed form events', () => {
    const action = { events: {}, type: 'FORM_EVENT_CHANGED' };
    const expectedStoreState = { events: { onFormInit: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed form save events', () => {
    const action = { events: {}, type: 'SAVE_EVENT_CHANGED' };
    const expectedStoreState = { events: { onFormSave: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should store the changed form observations control events', () => {
    const action = { events: {}, type: 'FORM_CONDITIONS_CHANGED' };
    const expectedStoreState = { events: { onFormConditionsUpdate: {} } };
    const state = formDetails({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return empty store when no type is passed', () => {
    const action = { events: {}, type: '' };
    const expectedStoreState = { events: { } };
    const state = formDetails({ events: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });
});
