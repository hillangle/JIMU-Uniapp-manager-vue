import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        // config.headers.post['Content-Type'] = 'application/json';   //主要是这里
        if (localStorage.getItem("token")) {
            config.headers.Authorization = "Bearer " + localStorage.getItem("token");
        }
        //     if (config.method === 'post') {
        //         var parm = {
        //             data : config.data
        //         }
        //         config.data = JSON.stringify(parm)
        //     }
        //     if (config.method === 'get') {
        //         config.params = {
        //             ...config.params,
        //         }
        //     }
        // }else{
        //     if (config.method === 'post') {
        //         config.data = JSON.stringify({...config.data})
        //     }
        return config;
        },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        console.log(error);
        return Promise.reject();
    }
);

export default service;
