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