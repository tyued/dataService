import fetch from 'utils/fetch';

// Rest服务注册   http api
export function putRest(obj) {
    return fetch({
        url: 'platform/service/registry/rest',
        method: 'post',
        data: obj
    });
}
// Soap服务注册   webservice
export function putSoap(obj) {
    return fetch({
        url: 'platform/service/registry/soap',
        method: 'post',
        data: obj
    });
}
// DataSet服务注册   数据源
export function putDataSet(obj) {
    return fetch({
        url: 'platform/service/registry/dataset',
        method: 'post',
        data: obj
    });
}
