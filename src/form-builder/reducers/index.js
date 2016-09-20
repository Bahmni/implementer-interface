import { combineReducers } from 'redux';
import controlDetails from './controlDetails';
import conceptToControlMapper from './conceptToControlMapper';

const implementerInterface = combineReducers({
  controlDetails,
  conceptToControlMapper,
});

export default implementerInterface;
