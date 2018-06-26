import fetch from 'utils/fetch';
// 获取已注册服务信息
export function getSubscribeList (data) {
  return fetch({
    url: 'admin/service/retrieve/list',
    method: 'post',
    data
  })
}

// 增加一个新的服务发布申请记录 提交服务发布申请
export function submitService (data) {
  return fetch({
    url: 'admin/service/publish/submit',
    method: 'post',
    data
  })
}




// 禁用服务接口！
export function forbiddenService (data) {
  return fetch({
    url: 'admin/service/mgmt/pause',
    method: 'post',
    data
  })
}

// 启用服务接口！
export function runService (data) {
  return fetch({
    url: 'admin/service/mgmt/deploy',
    method: 'post',
    data
  })
}

// 服务撤销！
export function cancelService (data) {
  return fetch({
    url: 'admin/service/mgmt/undeploy',
    method: 'post',
    data
  })
}