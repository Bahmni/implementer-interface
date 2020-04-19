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
