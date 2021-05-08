import request from '../utils/request';
import { baseUrl } from "../common/common.js";

export const getUserList = query => {
    return request({
        url: baseUrl + 'sys/user/getUserList',
        method: 'get',
        params: query
    });
};

export const updateDataStatus = query => {
    return request({
        url: baseUrl + 'sys/user/updateUserForStatus',
        method: 'post',
        params: query
    });
};
