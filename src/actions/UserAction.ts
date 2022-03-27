import * as types from '../constants/ActionTypes';

import Config from '../utils/Config';
import Request from '../utils/Request';

export const userAction = (reqData:any) => (dispatch:any) => {
    //模拟异步
    return setTimeout(() => {
        let data = {
            status:1,
            info:'success',
            data:[]
        };
        dispatch(userInfo(data));
    }, 2000);
};


function userInfo(data:any) {
    return {
        type: types.USER,
        ...data
    };
}
