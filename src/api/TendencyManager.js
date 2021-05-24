import request from '../utils/request';

export const getTendencyList = query => {
    return request({
        url: 'sys/tendency/getTendencyList',
        method: 'get',
        params: query
    });
};

export const updateTendencyStatus = query => {
    return request({
        url: 'sys/tendency/updateTendencyForStatus',
        method: 'post',
        params: query
    });
};