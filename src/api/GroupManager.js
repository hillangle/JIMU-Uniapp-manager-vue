import request from '../utils/request';
import { baseUrl } from "../common/common.js";

export const getGroupList = query => {
    return request({
        url: baseUrl + 'sys/group/getGroupList',
        method: 'get',
        params: query
    });
};

export const updateGroupStatus = query => {
    return request({
        url: baseUrl + 'sys/group/updateGroup',
        method: 'post',
        params: query
    });
};

export const addGroup = query => {
    return request({
        url: baseUrl + 'sys/group/addGroup',
        method: 'post',
        params: query
    });
};