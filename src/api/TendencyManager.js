import request from '../utils/request';
import { baseUrl } from "../common/common.js";

export const getTendencyList = query => {
    return request({
        url: baseUrl + 'sys/tendency/getTendencyList',
        method: 'get',
        params: query
    });
};

export const updateTendencyStatus = query => {
    return request({
        url: baseUrl + 'sys/tendency/updateTendencyForStatus',
        method: 'post',
        params: query
    });
};