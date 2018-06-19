import fetch from 'utils/fetch';

// 获取数据源列表
export function getList(obj) {
    return fetch({
        url: 'platform/service/datasource/list',
        method: 'post',
        data: obj
    });
}
// 查询数据源类型信息
export function getdbTypes(obj) {
    return fetch({
        url: 'platform/dataset/dbTypes',
        method: 'post',
        data: obj
    });
}
