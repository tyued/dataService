// 系统日志接口
import fetch from 'utils/fetch';

// 系统异常
export function postSystermLog(params) {
  return fetch({
    url: 'dsb/admin/service/logs/bizExcps',
    method: 'post',
    params
  });
}

// 服务异常
export function postServiceLog(params) {
  return fetch({
    url: 'dsb/admin/service/logs/servAcces',
    method: 'post',
    params
  });
}

// 登录日志
export function postLoginLog(params) {
  return fetch({
    url: 'dsb/admin/service/logs/authzOpts',
    method: 'post',
    params
  });
}

// 操作日志
export function postDoneLog(params) {
  return fetch({
    url: 'dsb/admin/service/logs/bizOpts',
    method: 'post',
    params
  });
}

// 获取操作类型opts
export function postOptTypes(params) {
  return fetch({
    url: 'dsb/admin/service/logs/optTypes',
    method: 'post',
    params
  });
}

// 获取服务类型
export function postServTypes(params) {
  return fetch({
    url: 'dsb/admin/service/logs/servTypes',
    method: 'post',
    params
  });
}