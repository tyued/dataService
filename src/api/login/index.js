import fetch from 'utils/fetch';

// 登录
export function userLogin(params) {
  return fetch({
    url: '/dsb/authz/login/slogin',
    method: 'post',
    params
  });
}