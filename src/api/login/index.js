import fetch from 'utils/fetch';

// 登录
export function userLogin(params) {
  return fetch({
    url: '/dsb/authz/login/slogin',
    method: 'post',
    params
  });
}

// --------------------------------------

// 带处理通知总数
export function postNoticeNumber(params) {
  return fetch({
    url: '/dsb/admin/service/notify/pending',
    method: 'post',
    params
  });
}

// 分页查询服务通知信息
export function postNoticeList(data) {
  return fetch({
    url: '/dsb/admin/service/notify/list',
    method: 'post',
    data
  });
}

// 单个已读 required id
export function postRead(params) {
  return fetch({
    url: '/dsb/admin/service/notify/read',
    method: 'post',
    params
  });
}

// 全部已读
export function postReadAll(params) {
  return fetch({
    url: '/dsb/admin/service/notify/readall',
    method: 'post',
    params
  });
}