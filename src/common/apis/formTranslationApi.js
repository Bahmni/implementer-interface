import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';

export function saveTranslations(translations) {
  return httpInterceptor.post(formBuilderConstants.saveTranslationsUrl, translations);
}
