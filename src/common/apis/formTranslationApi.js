/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';

export function translationsFor(formName, formVersion, locale, formUuid) {
  return httpInterceptor.get(new UrlHelper().bahmniFormTranslateUrl(formName,
    formVersion, locale, formUuid));
}


export function saveTranslations(translations) {
  return httpInterceptor.post(formBuilderConstants.saveTranslationsUrl, translations);
}

export function saveFormNameTranslations(nameTranslations, referenceUuid) {
  return httpInterceptor.post(new UrlHelper()
    .bahmniSaveFormNameTranslateUrl(referenceUuid), nameTranslations);
}


export function getFormNameTranslations(formName, formUuid) {
  return httpInterceptor.get(new UrlHelper()
      .bahmniFormNameTranslateUrl(formName, formUuid), 'text');
}
