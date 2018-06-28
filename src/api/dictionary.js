import fetch from 'utils/fetch';

// 查询数据源类型信息
export function getdbTypes(obj) {
    return fetch({
        url: 'platform/dataset/dbTypes',
        method: 'post',
        data: obj
    });
}
// 基础数据
export function getBaseData(query) {
    return fetch({
        url: 'platform/dataset/basedata',
        method: 'post',
        params: query
    });
}
// 查询数据源操作类型信息
export function getOptTypes(obj) {
    return fetch({
        url: 'platform/dataset/optTypes',
        method: 'post',
        data: obj
    });
}
// 数据源信息
export function getDatasources(obj) {
    return fetch({
        url: 'platform/dataset/datasources',
        method: 'post',
        data: obj
    });
}
// 数据表信息
export function getTables(query) {
    return fetch({
        url: 'platform/dataset/tables',
        method: 'post',
        params: query
    });
}
// 视图信息
export function getViews(query) {
    return fetch({
        url: 'platform/dataset/views',
        method: 'post',
        params: query
    });
}
// 列信息数据
export function getColumns(query) {
    return fetch({
        url: 'platform/dataset/columns',
        method: 'post',
        params: query
    });
}
// 条件与条件值关系信息
export function getRelations(query) {
    return fetch({
        url: 'platform/dataset/relations',
        method: 'post',
        params: query
    });
}
// 数据服务总线服务配置信息
export function getSettings(query) {
    return fetch({
        url: 'platform/dataset/settings',
        method: 'post',
        params: query
    });
}