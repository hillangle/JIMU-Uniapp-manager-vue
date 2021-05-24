import request from '../utils/request';

export const getSocialList = query => {
    return request({
        url: 'sys/social/getSocialList',
        method: 'get',
        params: query
    });
};

export const updateSocialStatus = query => {
    return request({
        url: 'sys/social/updateSocial',
        method: 'post',
        params: query
    });
};

export const addSocial = query => {
    return request({
        url: 'sys/social/addSocial',
        method: 'post',
        params: query
    });
};