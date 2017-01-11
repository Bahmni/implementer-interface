export const formBuilderConstants = {
  conceptUrl: '/openmrs/ws/rest/v1/concept',
  conceptRepresentation: 'custom:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),answers,hiNormal,lowNormal,' +
  'hiAbsolute,lowAbsolute,units,setMembers:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),' +
  'answers,hiNormal,lowNormal,hiAbsolute,lowAbsolute,units))',
  exceptionMessages: {
    conceptMissing: 'Please associate Concept to Obs',
  },
  // eslint-disable-next-line
  bahmniFormResourceUrl: '/openmrs/ws/rest/v1/bahmniie/form/save',
  formResourceDataType: 'org.bahmni.customdatatype.datatype.FileSystemStorageDatatype',
  formUrl: '/openmrs/ws/rest/v1/form',
  supportedObsDataTypes: 'Boolean,Text,Numeric,Coded,Date,DateTime',
  supportedObsGroupDataTypes: 'N/A',
};
