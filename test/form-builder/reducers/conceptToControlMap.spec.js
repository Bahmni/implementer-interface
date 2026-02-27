/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import conceptToControlMap from 'form-builder/reducers/conceptToControlMap';

describe('conceptToControlMap', () => {
  let action;
  beforeEach(() => {
    action = {
      type: 'SELECT_SOURCE',
      concept: {
        name: 'temperature',
        uuid: 'someUuid',
        type: 'text',
      },
      id: '123',
    };
  });

  it('should add concept to control mapping for a control', () => {
    const expectedStoreState = {
      123: action.concept,
    };
    const state = conceptToControlMap({}, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should add concept to control mapping for new concept', () => {
    const expectedStoreState = {
      456: {},
      123: action.concept,
    };
    const state = conceptToControlMap({ 456: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return store as is when action type does not match', () => {
    const expectedStoreState = {
      456: {},
    };

    action.type = 'SOME_RANDOM_TYPE';

    const state = conceptToControlMap({ 456: {} }, action);
    expect(state).to.be.eql(expectedStoreState);
  });

  it('should return default value of store when it is undefined', () => {
    action.type = 'SOME_RANDOM_TYPE';
    const state = conceptToControlMap(undefined, action);
    expect(state).to.be.eql({});
  });

  it('should remove source map', () => {
    action.type = 'REMOVE_SOURCE_MAP';
    const state = conceptToControlMap({ 123: {} }, action);
    expect(state).to.be.eql({});
  });

  it('should add source map to empty store', () => {
    action.type = 'ADD_SOURCE_MAP';
    action.sourceMap = {
      1: { name: 'someName-1', uuid: 'someUuid-1' },
      2: { name: 'someName-2', uuid: 'someUuid-2' },
    };
    const state = conceptToControlMap({}, action);
    expect(state).to.be.eql(action.sourceMap);
  });

  it('should add source map to existing store', () => {
    action.type = 'ADD_SOURCE_MAP';
    action.sourceMap = {
      1: { name: 'someName-1', uuid: 'someUuid-1' },
      2: { name: 'someName-2', uuid: 'someUuid-2' },
    };
    const store = {
      1: { name: 'someName-0', uuid: 'someUuid-0' },
      3: { name: 'someName-3', uuid: 'someUuid-3' },
    };
    const expectedSourceMap = {
      1: { name: 'someName-1', uuid: 'someUuid-1' },
      2: { name: 'someName-2', uuid: 'someUuid-2' },
      3: { name: 'someName-3', uuid: 'someUuid-3' },
    };

    const state = conceptToControlMap(store, action);
    expect(state).to.be.eql(expectedSourceMap);
  });
});
