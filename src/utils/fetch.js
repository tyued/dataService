import axios from 'axios';
import store from '../store';
import {
  Message,
  MessageBox
} from 'element-ui';

// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url
  // baseURL: 'http://192.168.0.111:8083',
  baseURL: 'http://192.168.0.49',
  // baseURL: 'localhost:8083',

  // timeout: 20000 // 请求超时时间
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
service.interceptors.response.use(function (res) {
  const {
    token
  } = res.data
  // Do something with response data
  switch (token) {
    case 'incorrect':
      Message.error('token不正确');
      break;
    case 'invaild':
      Message.error('token无效');
      break;
    case 'expiry': // be:我可以额外给你加个特殊标记 免得和其他请求数据分不清
      if (!store.getters.isOut) {
        store.commit('SET_ISOUT', true)
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
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
  return res;
}, function (error) {
  Message.error(error.message);
  // Do something with response error
  return Promise.reject(error);
});

export default service;
