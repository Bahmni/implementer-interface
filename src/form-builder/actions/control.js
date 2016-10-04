export const selectControl = (id) => ({ type: 'SELECT_CONTROL', id });

export const selectSource = (concept, id) => ({ type: 'SELECT_SOURCE', concept, id });

export const deselectControl = () => ({ type: 'DESELECT_CONTROL' });

export const removeSourceMap = () => ({ type: 'REMOVE_SOURCE_MAP' });

export const addSourceMap = (sourceMap) => ({ type: 'ADD_SOURCE_MAP', sourceMap });
