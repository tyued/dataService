import axios from 'axios';
import store from '../store';
import { Message, MessageBox } from 'element-ui';

// 创建axios实例
const service = axios.create({
  //baseURL: process.env.BASE_API, // api的base_url
  // baseURL: 'http://vincent1003.oicp.net:12673',
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
}
)

// respone拦截器
service.interceptors.response.use(function (res) {
  const { token } = res.data
  // Do something with response data
  switch (token) {
    case 'incorrect':
      this.$message.error('token不正确');
      break;
    case 'invaild':
      this.$message.error('token无效');
      break;
    case 'expiry': // be:我可以额外给你加个特殊标记 免得和其他请求数据分不清
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
      })
      break;
  }
  return res;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

export default service;
