import fetch from 'utils/fetch';
export async function getToken (params) {
    const res = await fetch({
        url: '/customer/myapp/list',
        method: 'post',
        params
    })
    return res
}