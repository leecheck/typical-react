import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import UserReducer from './UserReducer'

export default combineReducers({
    routing: routerReducer,
    UserReducer:UserReducer
})
