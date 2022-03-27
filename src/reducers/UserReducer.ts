import * as types from '../constants/ActionTypes';

const initialState = {
    status:0,
    info:'',
    data:[]
};
export default function LoginReducer(state = initialState, action:any){
    switch (action.type) {
        case types.USER:
            return Object.assign({}, state, action);
        default:
            return Object.assign(state);
    }
}