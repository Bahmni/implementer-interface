export const formBuilderConstants = {
  supportedDataTypes: 'Boolean,Text,Numeric',
  formUrl: '/openmrs/ws/rest/v1/form',
  formResourceUrl: (formUuid) => `/openmrs/ws/rest/v1/form/${formUuid}/resource`,
  conceptUrl: '/openmrs/ws/rest/v1/concept',
  conceptRepresentation: 'custom:(uuid,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),setMembers)',
  formResourceDataType: 'org.openmrs.customdatatype.datatype.FreeTextDatatype',
};
