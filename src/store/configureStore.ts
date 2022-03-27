import {createStore , applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import reducers from '../reducers';


let middlewares = [];

middlewares.push(thunk);
middlewares.push(logger);


const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState:any){
    return createStoreWithMiddleware(reducers,initialState);
}
