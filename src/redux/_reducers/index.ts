import { combineReducers } from 'redux';
import { authentication } from './auth_reducer';

const rootReducer = combineReducers({ 
    authentication
});

export default rootReducer;