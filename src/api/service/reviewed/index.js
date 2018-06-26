import fetch from 'utils/fetch';
// 获取已注册服务信息
export function getSubscribeList (data) {
  return fetch({
    url: 'admin/service/retrieve/list',
    method: 'post',
    data
  })
}
// 参数来源列表集合
export function getParamForms(data) {
  return fetch({
    url: 'platform/dataset/paramFroms',
    method: 'post',
    data
  })
}