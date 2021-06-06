import request from '../utils/request';

export const getGroupList = query => {
    return request({
        url: 'sys/group/getGroupList',
        method: 'get',
        params: query
    });
};

export const updateGroupStatus = query => {
    return request({
        url: 'sys/group/updateGroup',
        method: 'post',
        data: query
    });
};

export const addGroup = query => {
    return request({
        url: 'sys/group/addGroup',
        method: 'post',
        data: query
    });
};