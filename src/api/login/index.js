import fetch from 'utils/fetch';
// 获取验证码图片
export function getVerifyImg(params) {
  return fetch({
    url: 'kaptcha',
    method: 'get',
    responseType: 'arraybuffer',
    params
  });
}

// 登录
export function userLogin(params) {
  return fetch({
    url: '/authz/login/slogin',
    method: 'post',
    params
  });
}

// 登出
export function logOut () {
  return fetch({
    url: '/logout',
    method: 'post',
  })
}