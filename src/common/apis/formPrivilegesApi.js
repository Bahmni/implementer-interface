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

export function saveFormPrivileges(formPrivileges) {
  return httpInterceptor.post(formBuilderConstants.saveFormPrivilegesUrl, formPrivileges);
}
export function getFormPrivileges(formId, formVersion) {
  return httpInterceptor.get(new UrlHelper()
      .getFormPrivilegesUrl(formId, formVersion), 'text');
}

export function getFormPrivilegesFromUuid(formUuid) {
  return httpInterceptor.get(new UrlHelper()
      .getFormPrivilegesFromUuidUrl(formUuid), 'text');
}
