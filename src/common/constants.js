/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

const noOfFormsExportLimit = 20;
export const commonConstants = {
  responseType: {
    success: 'success',
    error: 'error',
  },
  saveSuccessMessage: 'Form Saved Successfully',
  publishSuccessMessage: 'Form Successfully Published',
  toastTimeout: 4000,
  logPath: '/var/log/openmrs/openmrs.log',
  exportNoOfFormsLimit: noOfFormsExportLimit,
  exportFormsLimit: `User is not allowed to select more than '${noOfFormsExportLimit}' forms`,
  exportFileName: 'Export.zip',
  exportFormsSuccessMessage: 'All forms Exported Successfully',
};
