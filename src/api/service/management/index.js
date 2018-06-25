import fetch from 'utils/fetch';
// 已订阅服务查询接口
export function getSubscribeList (data) {
  return fetch({
    url: 'api/admin/service/retrieve/list',
    method: 'post',
    data
  })
}

// 禁用服务接口
export function forbiddenService (data) {
  return fetch({
    url: 'api/admin/service/mgmt/pause',
    method: 'post',
    data
  })
}

// 启用服务接口
export function runService (data) {
  return fetch({
    url: 'api/admin/service/mgmt/deploy',
    method: 'post',
    data
  })
}

// 增加一个新的服务发布申请记录 提交服务发布申请
export function submitService (data) {
  return fetch({
    url: 'api/admin/service/publish/submit',
    method: 'post',
    data
  })
}