import fetch from 'utils/fetch';
// 分页查询待审批服务发布申请记录 -r
export function getReviewList (data) {
  return fetch({
    url: '/dsb/admin/service/review/list',
    method: 'post',
    data:data
  })
}

// 审批服务!发布!申请记录 
export function checkPublishRequest (data) {
  return fetch({
    url: '/dsb/admin/service/review/review',
    method: 'post',
    data
  })
}

// 可用的插件扩展实现对象信息
export function getExtensions (data) {
  return fetch({
    url: '/dsb/admin/service/plugin/extensions',
    method: 'post',
    data
  })
}



// 获取指定服务下指定的接口信息
export function getApiParamForms(params) {
  return fetch({
    url: '/dsb/admin/service/retrieve/api',
    method: 'post',
    params
  })
}

// 获取指定服务下所有接口信息
export function getApisParamForms(params) {
  return fetch({
    url: '/dsb/admin/service/retrieve/apis',
    method: 'post',
    params
  })
}