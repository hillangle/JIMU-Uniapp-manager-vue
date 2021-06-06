import axios from 'axios';

const service = axios.create({
    timeout: 30000
});

service.interceptors.request.use(
    config => {
        // config.headers.post['Content-Type'] = 'application/json';   //主要是这里
        if (localStorage.getItem("token")) {
            config.headers.Authorization = "Bearer " + localStorage.getItem("token");
        }
        // config.baseURL = 'http://127.0.0.1:8001/';
        config.baseURL = 'https://chat-api.jimdream.com/';
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
