import fetch from 'utils/fetch';
// import { type } from 'os';
/**
 * 用途：已订阅：查看（申请人、申请的应用、申请说明）、授权管理（签发秘钥、禁用、重置）
 * 注意：status=1
 * 说明：如果想完成该功能，应该先完成，应用管理、服务订阅功能
 * @param {appId} data 服务-调用申请应用ID编号-将要调用申请服务的应用ID (该参数来源于消费者申请调用一个服务的时候，需要选择自己哪个应用来调用，即系统中有应用管理、服务订阅功能没做)
 * @param {servId} data 服务-信息ID编号
 * @param {status} data 服务-调用申请状态：0:待审批|1:审批通过|2:审批不通过(用于筛选订阅申请数据)
 */
export function getPassSubscribeList(data) {
  return fetch({
    url: '/dsb/admin/service/subscribe/list',
    method: 'post',
    data
  })
}

// 未提交：查看、修改、撤销
export function getRetrieveList(data) {
  return fetch({
    url: '/dsb/admin/service/retrieve/list',
    method: 'post',
    data
  })
}

// 已发布（针对接口）：禁用  已禁用（针对接口）：启用  待审核：查看（审核、驳回）
export function getApiList(data) {
  return fetch({
    url: '/dsb/admin/service/api/retrieve/list',
    method: 'post',
    data
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
export function forbiddenService(params) {
  return fetch({
    // url: '/dsb/admin/service/mgmt/distory',
    url: '/dsb/admin/service/api/mgmt/pause',
    method: 'post',
    params
  })
}

// 启用服务接口！
export function runService(params) {
  return fetch({
    url: '/dsb/admin/service/api/mgmt/restore',
    method: 'post',
    params
  })
}

// 上线
export function deployService(params) {
  return fetch({
    url: '/dsb/admin/service/api/mgmt/deploy',
    method: 'post',
    params
  })
}

// 下线
export function destroyService(params) {
  return fetch({
    url: '/dsb/admin/service/api/mgmt/destroy',
    method: 'post',
    params
  })
}

// // 服务撤销！
// export function cancelService(data) {
//   return fetch({
//     url: '/dsb/admin/service/mgmt/undeploy',
//     method: 'post',
//     data
//   })
// }


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
    url: '/dsb/admin/service/api/plugin/extensions',
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

// -----------------------------服务授权------------------------------

// 查看按钮-审核通过
export function passReviewKey(data) {
  return fetch({
    url: '/dsb/admin/service/subscribe/review',
    method: 'post',
    data
  })
}

// 查询服务订阅授权信息
export function getKeyList(params) {
  return fetch({
    url: '/dsb/admin/service/authz/list',
    method: 'post',
    params
  })
}

// 重置授权秘钥
export function resetKey(params) {
  return fetch({
    url: '/dsb/admin/service/authz/reset',
    method: 'post',
    params
  })
}

// 更新授权状态
export function updateKey(params) {
  return fetch({
    url: '/dsb/admin/service/authz/status',
    method: 'post',
    params
  })
}


// ---------------------服务删除----------------------
// 更新授权状态
export function deleteService(type, params) {
  return fetch({
    url: `/dsb/admin/service/destroy/${type}`,
    method: 'post',
    params
  })
}

// 拉去服务list
export function getServList() {
  return fetch({
    url: `/dsb/admin/service/retrieve/pairs`,
    method: 'post',
  })
}




// 接口修改
export function submitEditIo(data, type) {
  let ty = ''
  switch (type) {
    case '1':
      ty = 'rest'
      break;
    case '2':
      ty = 'soap'
      break;
    case '3':
      ty = 'dataset'
      break;
  }
  return fetch({
    url: `/dsb/admin/service/api/renew/${ty}`,
    method: 'post',
    data
  })
} 