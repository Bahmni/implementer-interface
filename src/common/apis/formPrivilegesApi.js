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
