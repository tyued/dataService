import * as api from 'api/login'
import { getToken, setToken, removeToken } from 'utils/handleToken' 
const login = {
  state: {
    token: getToken(),
    username: '',

  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERNAME: (state, username) => {
      state.username = username;
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
            commit('SET_USERNAME', username);
            resolve(data);
          }
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 登出
    logOut({ commit, state }) {
      commit('SET_TOKEN', '');
      commit('SET_USERNAME', '');
      removeToken()
    },
  }
}

export default login;