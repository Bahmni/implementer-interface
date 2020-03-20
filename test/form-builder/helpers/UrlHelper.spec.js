import { expect } from 'chai';
import { UrlHelper } from 'form-builder/helpers/UrlHelper';

describe('UrlHelper', () => {
  const urlHelper = new UrlHelper();

  it('should return publish url', () => {
    const publishUrl = urlHelper.bahmniFormPublishUrl('someUuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/publish?formUuid=someUuid';
    expect(publishUrl).to.eql(expectedUrl);
  });

  it('should return full concept representation', () => {
    const conceptRepresentation = urlHelper.getFullConceptRepresentation('someConcept');
    const expectedUrl = '/openmrs/ws/rest/v1/concept?' +
        's=byFullySpecifiedName&locale=en&name=someConcept&v=bahmni';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });

  it('should return full form translate url', () => {
    const conceptRepresentation = urlHelper.bahmniFormTranslateUrl('name',
      'version', 'locale', 'formUuid');
    const expectedUrl = '/openmrs/ws/rest/v1/bahmniie/form/translate?' +
        'formName=name&formVersion=version&locale=locale&formUuid=formUuid';
    expect(conceptRepresentation).to.eql(expectedUrl);
  });
});
