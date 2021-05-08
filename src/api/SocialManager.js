import request from '../utils/request';
import { baseUrl } from "../common/common.js";

export const getSocialList = query => {
    return request({
        url: baseUrl + 'sys/social/getSocialList',
        method: 'get',
        params: query
    });
};

export const updateSocialStatus = query => {
    return request({
        url: baseUrl + 'sys/social/updateSocial',
        method: 'post',
        params: query
    });
};

export const addSocial = query => {
    return request({
        url: baseUrl + 'sys/social/addSocial',
        method: 'post',
        params: query
    });
};