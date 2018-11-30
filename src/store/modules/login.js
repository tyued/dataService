import * as api from 'api/login'
import { getToken, setToken, removeToken} from 'utils/handleToken'
const login = {
  state: {
    token: getToken() || '',
    noticeNumber: 0,
    userInfoObj: {},
    rightInfoObj: {},
    isOut: false,
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
          username: username,
          password: password,
          captcha,
          failureRetries
        }).then(res => {
          const { data, status } = res;
          if (status === 200 && data) {
            const { message, token, status } = data

            if (token) { // 如果有token 设置就完了
              setToken(token)
              commit('SET_TOKEN', token);
            }
            resolve(data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    logOut({ commit, rootState }) {
      commit('SET_TOKEN', '');
      commit('SET_ISDONE', false)
      commit('SET_RIGHTINFO', {})
      removeToken()
    },
    // 获取通知数
    getNoticeNumber({ commit }) {
      return new Promise((resolve, reject) => {
        api.postNoticeNumber().then(res => {
          const { data, status } = res;
          if (status === 200 && typeof data === "number") {
            let noticeNumber = data < 100 ? data : "99+";
            commit('SET_NOTICENUMBER', noticeNumber);
            resolve(noticeNumber);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取个人信息
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        api.queryCurrentUserInfo().then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            commit('SET_USERINFO', data)
            resolve(data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取权限信息
    getRightObj({ commit }) {
      return new Promise((resolve, reject) => {
        api.getRightObj().then(res => {
          const { status, data } = res;
          if (status === 200 && data) {
            let obj = {}
            data.map((item) => {
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
          }
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
}

export default login;