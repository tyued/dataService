import fetch from 'utils/fetch';

export function page(obj) {
    return fetch({
        url: 'dsb/customer/myapp/list',
        method: 'post',
        data: obj
    });
}

