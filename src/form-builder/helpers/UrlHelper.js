/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { formBuilderConstants } from 'form-builder/constants';

export class UrlHelper {
  bahmniFormPublishUrl(uuid) {
    return `/openmrs/ws/rest/v1/bahmniie/form/publish?formUuid=${uuid}`;
  }

  getFullConceptRepresentation(conceptName) {
    return '/openmrs/ws/rest/v1/concept?' +
            `s=byFullySpecifiedName&name=${conceptName}&v=bahmni`;
  }

  bahmniFormTranslateUrl(formName, formVersion, locale, formUuid) {
    return '/openmrs/ws/rest/v1/bahmniie/form/translate?' +
      `formName=${formName}&formVersion=${formVersion}&locale=${locale}&formUuid=${formUuid}`;
  }

  bahmniFormNameTranslateUrl(formName, formUuid) {
    return '/openmrs/ws/rest/v1/bahmniie/form/name/translate?' +
      `formName=${formName}&formUuid=${formUuid}`;
  }

  bahmniSaveFormNameTranslateUrl(referenceUuid) {
    return formBuilderConstants.saveNameTranslationsUrl +
      (referenceUuid ? `?referenceFormUuid=${referenceUuid}` : '');
  }
  getFormPrivilegesUrl(formId, formVersion) {
    return '/openmrs/ws/rest/v1/bahmniie/form/getFormPrivileges?' +
        `formId=${formId}&formVersion=${formVersion}`;
  }

  getFormPrivilegesUuidUrl(formUuid) {
    return '/openmrs/ws/rest/v1/bahmniie/form/getFormFromUuid?' +
        `formUuid=${formUuid}`;
  }
}
