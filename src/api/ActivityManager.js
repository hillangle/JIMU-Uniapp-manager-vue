import request from '../utils/request';

export const getActivityList = query => {
    return request({
        url: 'sys/activity/getActivityList',
        method: 'get',
        params: query
    });
};

export const updateActivityStatus = query => {
    return request({
        url: 'sys/activity/updateActivityForStatus',
        method: 'post',
        data: query
    });
};

export const addActivity = query => {
    return request({
        url: 'sys/activity/addActivity',
        method: 'post',
        data: query
    });
};