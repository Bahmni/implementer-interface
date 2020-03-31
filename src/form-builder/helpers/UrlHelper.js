import { formBuilderConstants } from 'form-builder/constants';

export class UrlHelper {
  bahmniFormPublishUrl(uuid) {
    return `/openmrs/ws/rest/v1/bahmniie/form/publish?formUuid=${uuid}`;
  }

  getFullConceptRepresentation(conceptName) {
    return '/openmrs/ws/rest/v1/concept?' +
            `s=byFullySpecifiedName&locale=en&name=${conceptName}&v=bahmni`;
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
}
