import Cookies from 'js-cookie'
const TokenKey = 'database_token_obj'
export const getToken = () => {
  // let obj = JSON.parse(window.localStorage.getItem('database_token_obj'))
  // if (obj) {
  //   if (obj.time < new Date().getTime()) {
  //     window.localStorage.removeItem('database_token_obj')
  //     return ''
  //   } else {
  //     return obj.time
  //   }
  // } else {
  //   return ''
  // }
  // let token = JSON.parse(window.localStorage.getItem('database_token_obj')) || ""
  return Cookies.get(TokenKey)
}

export const setToken = (token) => {
  // let obj = { // 设置token的过去时间为半个小时
  //   token,
  //   time: new Date().getTime() + 1800
  // }
  // window.localStorage.setItem('database_token_obj', JSON.stringify(token))
  Cookies.set(TokenKey, token)
}

export const removeToken = () => {
  Cookies.remove(TokenKey)
}
