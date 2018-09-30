// 系统监控接口：
import fetch from 'utils/fetch';

/**
 * 节点实例信息
 * @param id by id
 */
export function getInstance(params) {
  return fetch({
    url: 'dsb/admin/instances',
    method: 'get',
    params
  });
}

// detail信息获取
export function getDetail(params) {
  return fetch({
    url: `dsb/admin/instances/${params.id}/actuator/metrics/${params.type}`,
    method: 'get'
  });
}

// PID
export function getPID(params) {
  return fetch({
    url: `dsb/admin/instances/${params.id}/actuator/env/PID`,
    method: 'get'
  });
}




























// 所有节点实例事件信息
export function getAllInstanceEvent() {
  return fetch({
    url: 'dsb/admin/instances/events',
    method: 'get'
  });
}

// 获取某个指标的监控信息
export function getOneInstanceEvent(params) {
  return fetch({
    url: `/dsb/admin/instances/${params.id}/actuator/metrics/${params.name}`,
    method: 'get',
  });
}

// ========================================== 

// 所有节点应用信息
export function getAllApplication() {
  return fetch({
    url: 'dsb/admin/applications',
    method: 'get'
  });
}

/**
 * 单个节点应用信息
 * @param name  by name
 */
export function getOneApplication(params) {
  return fetch({
    url: 'dsb/admin/applications',
    method: 'get',
    params
  });
}