import fetch from 'utils/fetch';

// 登录
export function userLogin(params) {
  return fetch({
    url: '/dsb/authz/login/slogin',
    method: 'post',
    params
  });
}

// 查看已分配的功能-针对不同用户展示不同的功能
export function getRightObj() {
  return fetch({
    url: '/dsb/authz/user/features',
    method: 'post',
  });
}

// 查看所有权限树结构
export function getRightTree(params) {
  return fetch({
    url: '/dsb/authz/feature/flat',
    method: 'post',
    params
  });
}

// -------------------通知模块-------------------

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

// -------------------个人信息和密码模块-------------------

// 拉去用户信息
export function queryCurrentUserInfo() {
  return fetch({
    url: '/dsb/authz/user/detail',
    method: 'post',
  });
}

// 修改用户信息
export function postUserInfo(data) {
  return fetch({
    url: '/dsb/authz/user/reset/info',
    method: 'post',
    data
  });
}

// 修改密码 
export function postPassWord(params) {
  return fetch({
    url: '/dsb/authz/user/reset/pwd',
    method: 'post',
    params
  });
}

// ------------------权限模块--------------------

// 查询分配用户-查
export function getUser(data) {
  return fetch({
    url: '/dsb/authz/user/list',
    method: 'post',
    data
  });
}

// 角色-查by id
export function getUserListById(params) {
  return fetch({
    url: `/dsb/authz/user/detail/${params.id}`,
    method: 'post',
  });
}

// 增加用户信息-增
export function addUser(data) {
  return fetch({
    url: '/dsb/authz/user/new',
    method: 'post',
    data
  });
}

// 查询分配权限-改
export function updateUser(data) {
  return fetch({
    url: '/dsb/authz/user/edit',
    method: 'post', 
    data
  });
}

// 查询分配权限-删
export function deleteUser(params) {
  return fetch({
    url: `/dsb/authz/user/delete/${params.userid}`,
    method: 'post',
  });
}

// 添加和修改用户时，获取角色数组信息
export function getRoleArr() {
  return fetch({
    url: '/dsb/authz/role/roles',
    method: 'post',
  });
}

// ----------------

// 角色-查
export function getRoleList(data) {
  return fetch({
    url: `/dsb/authz/role/list`,
    method: 'post',
    data
  });
}

// 角色-查by id
export function getRoleListById(params) {
  return fetch({
    url: `/dsb/authz/role/detail/${params.id}`,
    method: 'post',
  });
}

// 角色-查-权限
export function getRoleRight(params) {
  return fetch({
    url: `/dsb/authz/role/features`,
    method: 'post',
    params
  });
}

// 角色-增
export function addRole(data) {
  return fetch({
    url: `/dsb/authz/role/new`,
    method: 'post',
    data
  });
}

// 角色-改
export function updateRole(data) {
  return fetch({
    url: `/dsb/authz/role/edit`,
    method: 'post',
    data
  });
}

// 角色-删
export function deleteRole(params) {
  return fetch({
    url: `/dsb/authz/role/delete/${params.roleid}`,
    method: 'post',
  });
}

// -----------------------------

// 我的应用模块：

// 应用-查
export function getAppList(data) {
  return fetch({
    url: `/dsb/customer/myapp/list`,
    method: 'post',
    data
  });
}

// 应用-查by id
export function getAppListById(params) {
  return fetch({
    url: `/dsb/customer/myapp/detail/${params.id}`,
    method: 'post',
  });
}

// 应用-增
export function addApp(data) {
  return fetch({
    url: `/dsb/customer/myapp/new`,
    method: 'post',
    data
  });
}

// 应用-改
export function updateApp(params) {
  return fetch({
    url: `/dsb/customer/myapp/edit/${params.appId}`,
    method: 'post',
  });
}

// 应用-删
export function deleteApp(params) {
  return fetch({
    url: `/dsb/customer/myapp/delete/${params.appId}`,
    method: 'post',
  });
}

