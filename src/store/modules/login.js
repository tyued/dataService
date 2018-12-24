import * as api from 'api/login'
import { getToken, setToken, removeToken } from 'utils/handleToken'
const login = {
  state: {
    token: getToken() || '', // 通知数
    noticeNumber: 0,  // 待处理通知数
    userInfoObj: {}, // 用户信息对象
    rightInfoObj: {}, // 权限对象
    isOut: false, // 开关
    activePath: '' // sidebar 高亮
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NOTICENUMBER: (state, noticeNumber) => {
      state.noticeNumber = noticeNumber
    },
    SET_USERINFO: (state, userInfoObj) => {
      state.userInfoObj = userInfoObj
    },
    SET_RIGHTINFO: (state, rightInfoObj) => {
      state.rightInfoObj = rightInfoObj
    },
    SET_ISOUT: (state, bool) => {
      state.isOut = bool
    },
    SET_SIDEBAR: (state, activePath) => {
      state.activePath = activePath
    },
  },
  actions: {
    // 登录
    userLogin({ commit }, userInfo) {
      const { username, password, captcha, failureRetries } = userInfo;
      return new Promise((resolve, reject) => {
        api.userLogin({
          username,
          password,
          captcha,
          failureRetries
        }).then(res => {
          const { token } = res
          if (token) { // 如果有token 设置就完了
            setToken(token)
            commit('SET_TOKEN', token);
          }
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    logOut({ commit }) {
      commit('SET_TOKEN', '');
      commit('SET_ISDONE', false)
      commit('SET_RIGHTINFO', {})
      removeToken()
    },
    // 获取通知数
    getNoticeNumber({ commit }) {
      return new Promise((resolve, reject) => {
        api.postNoticeNumber().then(res => {
          let noticeNumber = res < 100 ? res : "99+";
          commit('SET_NOTICENUMBER', noticeNumber);
          resolve(noticeNumber);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取个人信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        api.queryCurrentUserInfo().then(res => {
          commit('SET_USERINFO', res)
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取权限信息
    getRightObj({ commit }) {
      return new Promise((resolve, reject) => {
        api.getRightObj().then(res => {
          let obj = {}
          res.map((item) => {
            obj[item.code] = {}
            item.perms && item.perms.split(',').forEach((ele) => {
              obj[item.code][ele] = true
            })
          })
          // if (!store.getters.isadmin) {
          //   obj['serv-api']['serv-api:review'] = false
          //   obj['serv-api']['serv-api:deploy'] = false
          //   obj['serv-api']['serv-api:destroy'] = false
          // }
          commit('SET_RIGHTINFO', obj)
          resolve(obj);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
}

export default login;