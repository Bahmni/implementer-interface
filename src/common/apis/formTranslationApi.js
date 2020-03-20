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
