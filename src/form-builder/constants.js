export const formBuilderConstants = {
  conceptUrl: '/openmrs/ws/rest/v1/concept',
  conceptRepresentation: 'custom:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),answers,handler,hiNormal,lowNormal,' +
  'hiAbsolute,lowAbsolute,units,setMembers:(uuid,set,display,allowDecimal,name:(uuid,name),' +
  'conceptClass:(uuid,name),datatype:(uuid,name),' +
  'answers,hiNormal,lowNormal,hiAbsolute,lowAbsolute,units))',
  exceptionMessages: {
    conceptMissing: 'Please associate Concept to Obs',
    emptySectionOrTable: 'Section/Table is empty',
  },
  // eslint-disable-next-line
  bahmniFormResourceUrl: '/openmrs/ws/rest/v1/bahmniie/form/save',
  formResourceDataType: 'org.bahmni.customdatatype.datatype.FileSystemStorageDatatype',
  formUrl: '/openmrs/ws/rest/v1/form',
  supportedObsDataTypes: 'Boolean,Text,Numeric,Coded,Date,DateTime,Complex',
  supportedObsGroupDataTypes: 'N/A',
  defaultLocaleUrl: '/openmrs/ws/rest/v1/bahmnicore/sql/globalproperty?property=default_locale',
  allowedLocalesUrl: '/bahmni_config/openmrs/apps/home/locale_languages.json',
  translationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/translations',
  formTranslationUrl: '/openmrs/ws/rest/v1/bahmniie/form/translate',
  saveTranslationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/saveTranslation',
  saveNameTranslationsUrl: '/openmrs/ws/rest/v1/bahmniie/form/name/saveTranslation',
  exportUrl: '/openmrs/ws/rest/v1/bahmniie/form/export',
  formPrivilegeUrl: '/openmrs/ws/rest/v1/privilege',
  saveFormPrivilegesUrl: '/openmrs/ws/rest/v1/bahmniie/form/saveFormPrivileges',
  getFormPrivilegesUrl: '/openmrs/ws/rest/v1/bahmniie/form/getFormPrivileges',
  getFormPrivilegesFromUuidUrl: '/openmrs/ws/rest/v1/bahmniie/form/getFormPrivilegesFromUuid',
  jsonToPdfConvertionUrl: '/openmrs/ws/rest/v1/bahmniie/form/jsonToPdf',
  pdfDownloadUrl: '/openmrs/ws/rest/v1/bahmniie/form/download/',
  dataLimit: 9999,
  formDefinitionVersion: 2.0,
};
