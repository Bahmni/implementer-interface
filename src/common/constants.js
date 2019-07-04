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
};
