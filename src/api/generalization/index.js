import fetch from 'utils/fetch';

// export function page(obj) {
//     return fetch({
//         url: 'dsb/customer/myapp/list',
//         method: 'post',
//         data: obj
//     });
// }

// 最新服务访问异常数据--------接口有问题
export function errorLastest(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/errorLastest',
        method: 'post',
        data: obj
    });
}
// 异常类型汇总--------接口有问题
export function errorRatio(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/errorRatio',
        method: 'post',
        data: obj
    });
}
// 综合统计信息
export function metircs(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/metircs',
        method: 'post',
        data: obj
    });
}
// 最近10条服务发布申请记录--------接口有问题
export function pubTop10(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/pubTop10',
        method: 'post',
        data: obj
    });
}
// 服务访问量Top5--------接口有问题
export function pvTop5(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/pvTop5',
        method: 'post',
        data: obj
    });
}
// 服务订阅量Top5--------接口有问题
export function subTop5(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/subTop5',
        method: 'post',
        data: obj
    });
}
// 系统概况
export function survey(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/survey',
        method: 'post',
        data: obj
    });
}
// 用户订阅量Top5--------接口有问题
export function userTop5(obj) {
    return fetch({
        url: '/dsb/platform/service/metirc/userTop5',
        method: 'post',
        data: obj
    });
}
