import { combineReducers } from 'redux';
import controlDetails from './controlDetails';
import conceptToControlMap from './conceptToControlMap';

const implementerInterface = combineReducers({
  controlDetails,
  conceptToControlMap,
});

export default implementerInterface;
