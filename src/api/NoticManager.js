import request from '../utils/request';

export const getNoticList = query => {
    return request({
        url: 'sys/notic/getNoticList',
        method: 'get',
        params: query
    });
};

export const updateNoticStatus = query => {
    return request({
        url: 'sys/notic/updateNotic',
        method: 'post',
        params: query
    });
};

export const addNotic = query => {
    return request({
        url: 'sys/notic/addNotic',
        method: 'post',
        params: query
    });
};