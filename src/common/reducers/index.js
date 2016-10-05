import { combineReducers } from 'redux';
import formBuilder from 'form-builder/reducers';

const reducers = Object.assign({}, formBuilder);
const implementerInterface = combineReducers(reducers);

export default implementerInterface;
