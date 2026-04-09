/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';

describe('UrlHelper', () => {
  const urlHelper = new UrlHelper();

  it('should return publish url', () => {
    const publishUrl = urlHelper.bahmniFormPublishUrl('someUuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/publish?formUuid=someUuid';
    expect(publishUrl).to.eql(expectedUrl);
  });

  it('should return full concept representation', () => {
    const conceptRepresentation = urlHelper.getFullConceptRepresentation('someConcept');
    const expectedUrl = '/openmrs/ws/rest/v1/concept?' +
        's=byFullySpecifiedName&name=someConcept&v=bahmni';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });

  it('should return full form translate url', () => {
    const conceptRepresentation = urlHelper.bahmniFormTranslateUrl('name',
      'version', 'locale', 'formUuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/translate?' +
        'formName=name&formVersion=version&locale=locale&formUuid=formUuid';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });

  it('should return form name translate url', () => {
    const conceptRepresentation = urlHelper.bahmniFormNameTranslateUrl('name', 'formUuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/name/translate?' +
      'formName=name&formUuid=formUuid';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });

  it('should return save form name translate url without query parameters', () => {
    const conceptRepresentation = urlHelper.bahmniSaveFormNameTranslateUrl(null);
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/name/saveTranslation';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });

  it('should return save form name translate url with query parameters', () => {
    const conceptRepresentation = urlHelper.bahmniSaveFormNameTranslateUrl('ref-uuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/name/saveTranslation?' +
      'referenceFormUuid=ref-uuid';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });
});
