import request from '../utils/request';

export const getUserList = query => {
    return request({
        url: 'sys/user/getUserList',
        method: 'get',
        params: query
    });
};

export const updateDataStatus = query => {
    return request({
        url: 'sys/user/updateUserForStatus',
        method: 'post',
        params: query
    });
};
