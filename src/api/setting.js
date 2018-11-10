import fetch from 'utils/fetch';

// 根据分组查询系统参数
export function getSys(data) {
  return fetch({
    url: '/dsb/admin/service/settings/list',
    method: 'post',
    data
  });
}

// 批量更新分组内的系统参数
export function updateSys(data) {
  return fetch({
    url: '/dsb/admin/service/settings/batch/update',
    method: 'post',
    data
  });
}
// --------------------------------------
// 获取基础数据
export function getBase(data) {
  return fetch({
    url: '/dsb/admin/service/basedata/list',
    method: 'post',
    data
  });
}
// get基础数据
export function getBaseById(params) {
  return fetch({
    url: `/dsb/admin/service/basedata/detail/${params.id}`,
    method: 'post',
  });
}
// 更新基础数据
export function updateBase(data) {
  return fetch({
    url: '/dsb/admin/service/basedata/update',
    method: 'post',
    data
  });
}
// 删除基础数据
export function delBase(params) {
  return fetch({
    url: '/dsb/admin/service/basedata/delete',
    method: 'post',
    params
  });
}
// 启用禁用
export function toggleBase(params) {
  return fetch({
    url: '/dsb/admin/service/basedata/status',
    method: 'post',
    params
  });
}

// add基础数据
export function addBase(data) {
  return fetch({
    url: '/dsb/admin/service/basedata/new',
    method: 'post',
    data
  });
}


// 基础数据type 类型
export function getTypes(params) {
  return fetch({
    url: '/dsb/admin/service/basedata/types',
    method: 'post',
    params
  });
}