import fetch from 'utils/fetch';

// 数据源服务查询
export function getDataset(query) {
  return fetch({
    url: 'admin/service/retrieve/dataset',
    method: 'post',
    params: query
  })
} 
// Rest服务查询
export function getRest(query) {
  return fetch({
    url: 'admin/service/retrieve/rest',
    method: 'post',
    params: query
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
// 条件与条件值关系信息
export function getRelationForms(data) {
  return fetch({
    url: 'platform/dataset/relations',
    method: 'post',
    data
  })
}


