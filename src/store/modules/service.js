import {
  getBaseData
} from 'api/dictionary'
// import {
//   MessageBox
// } from 'element-ui';
const service = {
  state: {
    getfuwindex_on: [true, false, false, false], //服务首页高亮
    servTagArr: [],
    compName: 'mainService' // 当前的动态组件
  },
  mutations: {
    SET_fuwindex_on: (state, data) => {
      state.getfuwindex_on = data;
    },
    SET_servTagArr: (state, data) => {
      state.servTagArr = data;
    },
    SET_compName: (state, data) => {
      state.compName = data
    }
  },
  actions: {
    GET_fuwindex_on: ({
      commit
    }, data) => {
      commit('SET_fuwindex_on', data)
    },
    setServTagArr: ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        // 获取servType ，里面很多地方要用到
        getBaseData({
          group: "servType"
        }).then(res => {
          const {
            status,
            data
          } = res;
          if (status === 200 && data) {
            commit('SET_servTagArr', data)
            resolve(data)
          }
        }).catch(error => {
          reject(error);
        });
      });
    }
  },
}

export default service;
