import fetch from 'utils/fetch';


// 数据源服务查询
export function getDataset(query) {
  return fetch({
    url: '/dsb/admin/service/retrieve/dataset',
    method: 'post',
    params: query
  })
} 
// Rest服务查询
export function getRest(query) {
  return fetch({
    url: '/dsb/admin/service/retrieve/rest',
    method: 'post',
    params: query
  })
}
// Soap服务查询
export function getSoap(query) {
  return fetch({
    url: '/dsb/admin/service/retrieve/soap',
    method: 'post',
    params: query
  })
}

// 猜你喜欢服务信息
export function getEnjoy(query) {
  return fetch({
    url: '/dsb/admin/service/retrieve/enjoy',
    method: 'post',
    params: query
  })
}

// 服务错误对照信息
export function getErrorCode(query) {
  return fetch({
    url: '/dsb/platform/dataset/error-codes',
    method: 'post',
    params: query
  })
}

// 参数来源列表集合
export function getParamForms(data) {
  return fetch({
    url: '/dsb/platform/dataset/paramFroms',
    method: 'post',
    data
  })
}
// 条件与条件值关系信息
export function getRelationForms(data) {
  return fetch({
    url: '/dsb/platform/dataset/relations',
    method: 'post',
    data
  })
}

// 增加一个新的服务评价信息
export function submitAssess(data) {
  return fetch({
    url: '/dsb/admin/service/eval/submit',
    method: 'post',
    data
  })
}

// 查询服务评价信息集合
export function getAssessList(params) {
  return fetch({
    url: '/dsb/admin/service/eval/evalList',
    method: 'post',
    params
  })
}

// 获取服务评价信息统计
export function getEvalStats(params) {
  return fetch({
    url: '/dsb/admin/service/eval/stats',
    method: 'post',
    params
  })
}

// 意见反馈中的排序功能 
export function getEvalSort(params) {
  return fetch({
    url: '/dsb/admin/service/eval/evals',
    method: 'post',
    params
  })
}


// 订阅
export function subscribe(data) {
  return fetch({
    url: '/dsb/customer/service/available/subscribe',
    method: 'post',
    data
  })
}

// 取消订阅
export function unSubscribe(params) {
  return fetch({
    url: '/dsb/customer/service/available/unsubscribe',
    method: 'post',
    params
  })
}

// 不分页获取应用列表
export function getAppList() {
  return fetch({
    url: '/dsb/customer/myapp/values',
    method: 'post',
  })
}