import fetch from 'utils/fetch';

// export function page(obj) {
//     return fetch({
//         url: 'dsb/customer/myapp/list',
//         method: 'post',
//         data: obj
//     });
// }

// 最新服务访问异常数据
export function errorLastest(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/errorLastest',
        method: 'post',
        data: obj
    });
}
// 异常类型汇总
export function errorRatio(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/errorRatio',
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


// ===============================================================
// 最近10条服务发布申请记录
export function pubTop10(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/pubTop10',
        method: 'post',
        data: obj
    });
}
// 服务访问量Top5
export function pvTop5(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/pvTop5',
        method: 'post',
        data: obj
    });
}
// 服务订阅量Top5
export function subTop5(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/subTop5',
        method: 'post',
        data: obj
    });
}
// 系统概况
export function survey(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/survey',
        method: 'post',
        data: obj
    });
}
// 用户订阅量Top5
export function userTop5(obj) {
    return fetch({
        url: '/dsb/admin/service/stats/userTop5',
        method: 'post',
        data: obj
    });
}


// 申请接入列表查看按钮  params: subId
export function showServiceDetail(params) {
    return fetch({
        url: `/dsb/admin/service/subscribe/${params.subId}`,
        method: 'post',
    });
}

// ======================== customer index page io ===============================
// 用户的首页总接口
export function getAllInfoForCustomer() {
    return fetch({
        url: `/dsb/customer/homepage/metircs`,
        method: 'post',
    });
}