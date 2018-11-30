// 服务监控接口：
import fetch from 'utils/fetch';

/**
 * 按时间获取服务接口调用平均耗时统计信息
 * @param {servId} params required string  服务ID
 * @param {begintime} params required string  开始时间
 * @param {endtime} params required string  结束时间
 * @param {byType} params required string  统计方式：1：按小时、2：按日 Default value : 1
 */
export function postAvgTime(params) {
  return fetch({
    url: 'dsb/admin/service/api/stats/avgTime',
    method: 'post',
    params
  });
}

/**
 * 按时间获取服务接口调用次数统计信息
 * @param {servId} params required string  服务ID
 * @param {begintime} params required string  开始时间
 * @param {endtime} params required string  结束时间
 * @param {byType} params required string  统计方式：1：按小时、2：按日 Default value : 1
 */
export function postCallTimes(params) {
  return fetch({
    url: 'dsb/admin/service/api/stats/callTimes',
    method: 'post',
    params
  });
}

/**
 * 获取服务昨日内的服务接口调用统计信息
 * @param {servid} params required string 服务ID
 */
export function postYesterday(params) {
  return fetch({
    url: 'dsb/admin/service/api/stats/daily',
    method: 'post',
    params
  });
}

/**
 * 获取往日服务接口调用详细统计信息
 */
export function postDetail(data) {
  return fetch({
    url: 'dsb/admin/service/api/stats/detail',
    method: 'post',
    data
  });
}

/**
 * 按时间获取服务接口调用失败率统计信息
 * @param {servId} params required string  服务ID
 * @param {begintime} params required string  开始时间
 * @param {endtime} params required string  结束时间
 * @param {byType} params required string  统计方式：1：按小时、2：按日 Default value : 1
 */
export function postFailCount(params) {
  return fetch({
    url: 'dsb/admin/service/api/stats/failures',
    method: 'post',
    params
  });
}

/**
 * 按时间获取服务接口调用 最大耗时 统计信息
 * @param {servId} params required string  服务ID
 * @param {begintime} params required string  开始时间
 * @param {endtime} params required string  结束时间
 * @param {byType} params required string  统计方式：1：按小时、2：按日 Default value : 1
 */
export function postMaxTime(params) {
  return fetch({
    url: 'dsb/admin/service/api/stats/maxTime',
    method: 'post',
    params
  });
}




// 获取接口list by 服务id
export function postInterfaceList(params) {
  return fetch({
    url: 'dsb/admin/service/retrieve/apis',
    method: 'post',
    params
  });
}

/**
 * 获取服务list
 * {
  "byType": "1",
  "limit": 15,
  "pageNo": 1,
  "servId": "string",
  "sortName": "name",
  "sortOrder": "desc"
}
 */
export function postQueryList(data) {
  return fetch({
    url: 'dsb/admin/service/stats/list',
    method: 'post',
    data
  });
}
