import fetch from 'utils/fetch';

// 参数来源列表集合
export function getParamForms(data) {
  return fetch({
    url: 'platform/dataset/paramFroms',
    method: 'post',
    data
  })
}
// 条件与条件值关系信息
export function getRelationForms(data) {
  return fetch({
    url: 'platform/dataset/relations',
    method: 'post',
    data
  })
}
