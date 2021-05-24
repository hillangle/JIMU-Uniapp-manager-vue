import request from '../utils/request';

export const login = query => {
    return request.post('auth/login', query);
};