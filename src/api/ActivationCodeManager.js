import request from '../utils/request';

export const getActivationCodeList = query => {
    return request({
        url: 'sys/activationCode/getActivationCodeList',
        method: 'get',
        params: query
    });
};

export const addActivationCode = query => {
    return request({
        url: 'sys/activationCode/addActivationCode',
        method: 'post',
        params: query
    });
};

export const exportActivationCode = query => {
    return request({
        url: 'sys/activationCode/exportActivationCode',
        method: 'get',
        params: query,
        responseType: "blob", // 下载必须指定服务器响应的数据类型
        headers: {
            "Content-Type": "application/json;application/octet-stream"
        }
    });
};