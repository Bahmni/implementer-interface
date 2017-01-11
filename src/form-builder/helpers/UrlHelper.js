export class UrlHelper {
  bahmniFormPublishUrl(uuid) {
    return `/openmrs/ws/rest/v1/bahmniie/form/publish?formUuid=${uuid}`;
  }

  getFullConceptRepresentation(conceptName) {
    return '/openmrs/ws/rest/v1/concept?' +
            `s=byFullySpecifiedName&locale=en&name=${conceptName}&v=bahmni`;
  }
}
