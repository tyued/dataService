import * as api from 'api/login'
const login = {
  state: {
    token: JSON.parse(window.sessionStorage.getItem('data-service-token')) || '',
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
      const { username, password, captcha } = userInfo;
      return new Promise((resolve, reject) => {
        api.userLogin({
          username: username,
          password: password,
          captcha
        }).then(res => {
          console.log(res)
          const { data, status } = res;
          if (status === 200 && data) {
            const { message, token, status } = data
            
            if (token) { // 如果有token说明第一次登陆或者token过期了
              window.sessionStorage.setItem('Authorization', JSON.stringify(token))
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
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.logOut().then(() => {
          commit('SET_TOKEN', '');
          commit('SET_USERNAME', '');
          window.sessionStorage.removeItem('Authorization')
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
  }
}

export default login;