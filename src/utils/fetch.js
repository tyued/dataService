import axios from 'axios';
import store from '../store';
import {
  Message,
  MessageBox
} from 'element-ui';
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // config/[name].env.js
  timeout: 20000 // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
  //console.log("这里是请求拦截器")
  // Do something before request is sent
  config.headers['Authorization'] = store.getters.token;
  //console.log(config);
  return config;
}, error => {
  // Do something with request error
  //console.log(error); // for debug
  Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(function ({ data, status }) {
  // Do something with response data
  switch (data.token) {
    case 'incorrect':
      Message.error('token不正确');
      break;
    case 'invaild':
      Message.error('token无效');
      break;
    case 'expiry': // 后台:我可以额外给你加个特殊标记 免得和其他请求数据分不清
      if (!store.getters.isOut) { // 因为会有多个响应，会一直弹，这里要加一个控制开关，存全局
        store.commit('SET_ISOUT', true)
        MessageBox.confirm('会话已过期，可以取消继续留在该页面，或者重新登录', '会话过期', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('logOut')
            .then(() => {
              location.reload(); // 为了重新实例化vue-router对象 避免bug
              return
            })
        }).catch(() => {
          store.commit('SET_ISOUT', false)
        })
      }
      break;
  }
  // 如果响应200 并且data存在 则返回
  if (status === 200 && data != undefined) { // [] {} null 0 false >????
    return data;
  } 
}, function (error) {
  Message.error(error.message);
  // Do something with response error
  return Promise.reject(error);
});

export default service;
