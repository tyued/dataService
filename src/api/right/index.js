
import fetch from 'utils/fetch';

// 查看所有权限树结构
export function getRightTree(params) {
  return fetch({
    url: '/dsb/authz/feature/flat',
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
    url: `/dsb/authz/user/delete/${params.id}`,
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
    url: `/dsb/authz/role/delete/${params.id}`,
    method: 'post',
  });
}

// --------------- 数据提供商 --------------
// 数据提供商-查
export function getProducerList(data) {
  return fetch({
    url: `/dsb/producer/info/list`,
    method: 'post',
    data
  });
}

// 数据提供商-查by id
export function getProducerListById(params) {
  return fetch({
    url: `/dsb/producer/info/detail/${params.id}`,
    method: 'post',
  });
}

// 数据提供商-增
export function addProducer(data) {
  return fetch({
    url: `/dsb/producer/info/registry`,
    method: 'post',
    data
  });
}

// 数据提供商-改
export function updateProducer(data) {
  return fetch({
    url: `/dsb/producer/info/edit`,
    method: 'post',
    data
  });
}

// 数据提供商-删
export function deleteProducer(params) {
  return fetch({
    url: `/dsb/producer/info/delete/${params.id}`,
    method: 'post',
  });
}

// 数据提供商-改-状态
export function getProducerValueList() {
  return fetch({
    url: `/dsb/producer/info/values`,
    method: 'post',
  });
}

// // 数据提供商-改-状态
// export function changeProducerStatus(params) {
//   return fetch({
//     url: `/dsb/producer/info/status`,
//     method: 'post',
//     params
//   });
// }