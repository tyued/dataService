import fetch from 'utils/fetch';

// 获取数据源列表
export function getList(obj) {
    return fetch({
        url: 'platform/service/datasource/list',
        method: 'post',
        data: obj
    });
}
// 创建新数据源
export function addnew(obj) {
    return fetch({
        url: 'platform/service/datasource/new',
        method: 'post',
        data: obj
    });
}
// 获取单个数据源信息
export function getObj(query) {
    return fetch({
        url: 'platform/service/datasource/get',
        method: 'post',
        params: query
    });
}
// 修改数据源
export function editObj(query,obj) {
    return fetch({
        url: 'platform/service/datasource/edit',
        method: 'post',
        params: query,
        data: obj
    });
}
// 删除数据源
export function delObj(query) {
    return fetch({
        url: 'platform/service/datasource/delete',
        method: 'post',
        params: query,
    });
}
// 数据源连接有效性测试
export function testObj(query) {
    return fetch({
        url: 'platform/service/datasource/test',
        method: 'post',
        params: query,
    });
}
