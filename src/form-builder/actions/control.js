export const selectControl = (metadata, isConceptMapEvent) => ({ type: 'SELECT_CONTROL', metadata,
  isConceptMapEvent });

export const selectSource = (concept, id) => ({ type: 'SELECT_SOURCE', concept, id });

export const deselectControl = () => ({ type: 'DESELECT_CONTROL' });

export const removeSourceMap = () => ({ type: 'REMOVE_SOURCE_MAP' });

export const addSourceMap = (sourceMap) => ({ type: 'ADD_SOURCE_MAP', sourceMap });

export const setChangedProperty = (property, id) =>
  ({ type: 'SET_CHANGED_PROPERTY', property, id });

export const sourceChangedProperty = (source, id) => ({ type: 'SOURCE_CHANGED', source, id });

export const dragSourceUpdate = (cell) => ({ type: 'DRAG_SOURCE_CHANGED', cell });

export const formEventUpdate = (events) => ({ type: 'FORM_EVENT_CHANGED', events });

export const saveEventUpdate = (events) => ({ type: 'SAVE_EVENT_CHANGED', events });

export const removeControlProperties = () => ({ type: 'REMOVE_CONTROL_PROPERTIES' });

export const focusControl = (id) => ({ type: 'FOCUS_CONTROL', id });

export const blurControl = () => ({ type: 'BLUR_CONTROL' });

export const setDefaultLocale = (locale) => ({ type: 'SET_DEFAULT_LOCALE', locale });

export const generateTranslations = (control) => ({ type: 'GENERATE_TRANSLATIONS', control });

export const updateTranslations = (control) => ({ type: 'UPDATE_TRANSLATIONS', control });

export const removeLocaleTranslation =
  (locale) => ({ type: 'REMOVE_LOCALE_TRANSLATIONS', locale });

export const clearTranslations = () => ({ type: 'CLEAR_TRANSLATIONS' });

export const formConditionsEventUpdate = (events) => ({ type: 'FORM_CONDITIONS_CHANGED', events });

export const formLoad = (controls) => ({ type: 'FORM_LOAD', controls });

export const deleteControl = (controlIds) => ({ type: 'DELETE_CONTROL', controlIds });

export const formDefVersionUpdate = (version) => ({ type: 'FORM_DEFINITION_VERSION_UPDATE', version });
