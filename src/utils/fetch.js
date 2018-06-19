import axios from 'axios';
import store from '../store';


// 创建axios实例
const service = axios.create({
    //baseURL: process.env.BASE_API, // api的base_url
    // baseURL: process.env.BASE_API,
    timeout: 20000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    //console.log("这里是请求拦截器")
    // Do something before request is sent
    config.headers['Authorization'] = ''; 
    //console.log(config);
        return config;
}, error => {
    // Do something with request error
    //console.log(error); // for debug
    Promise.reject(error);
}
)

// respone拦截器
service.interceptors.response.use(

);

export default service;
