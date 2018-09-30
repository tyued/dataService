import fetch from 'utils/fetch';
/**
 * 用途：查询已经审批通过的服务订阅记录
 * 注意：status=1
 * 说明：如果想完成该功能，应该先完成，应用管理、服务订阅功能
 * @param {appId} data 服务-调用申请应用ID编号-将要调用申请服务的应用ID (该参数来源于消费者申请调用一个服务的时候，需要选择自己哪个应用来调用，即系统中有应用管理、服务订阅功能没做)
 * @param {servId} data 服务-信息ID编号
 * @param {status} data 服务-调用申请状态：0:待审批|1:审批通过|2:审批不通过(用于筛选订阅申请数据)
 */
export function getPassSubscribeList (data) {
  return fetch({
    url: '/dsb/admin/service/subscribe/list',
    method: 'post',
    data
  })
}

// 获取已订阅 列表
export function getSubscribeList (data) {
  return fetch({
    url: '/dsb/admin/service/retrieve/list',
    method: 'post',
    data
  })
}

// 待审批服务发布申请    0:待审核|1:审核通过|2:审核不通过
export function getReviewTG (data) {
  return fetch({
    url: '/dsb/admin/service/review/list',
    method: 'post',
    data:data
  })
}

// 增加一个新的服务发布申请记录 提交服务发布申请
export function submitService (data) {
  return fetch({
    url: '/dsb/admin/service/publish/submit',
    method: 'post',
    data
  })
}

// 获取已发布的服务接口信息
export function getPubList (data) {
  return fetch({
    url: '/dsb/admin/service/retrieve/list',
    method: 'post',
    data
  })
}

// 获取待审核 & 已禁用的服务接口信息
export function getApiList (data) {
  return fetch({
    url: '/dsb/admin/service/retrieve/apiList',
    method: 'post',
    data
  })
}

// 获取指定服务下指定的接口信息
export function getApiParamForms(params) {
  return fetch({
    url: '/dsb/admin/service/retrieve/apis',
    method: 'post',
    params
  })
}

// 已发布-修改按钮
export function editApi(data) {
  return fetch({
    url: '/dsb/admin/service/retrieve/api',
    method: 'post',
    data
  })
}

// 禁用服务接口！
export function forbiddenService (data) {
  return fetch({
    url: '/dsb/admin/service/mgmt/pause',
    method: 'post',
    data
  })
}

// 启用服务接口！
export function runService (data) {
  return fetch({
    url: '/dsb/admin/service/mgmt/deploy',
    method: 'post',
    data
  })
}

// 服务撤销！
export function cancelService (data) {
  return fetch({
    url: '/dsb/admin/service/mgmt/undeploy',
    method: 'post',
    data
  })
}

// 获取接口list by 服务id
export function postApisListById(data) {
  return fetch({
    url: 'dsb/admin/service/retrieve/apis',
    method: 'post',
    data
  });
}