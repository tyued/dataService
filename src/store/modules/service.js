import {
  getBaseData
} from 'api/dictionary'
// import {
//   MessageBox
// } from 'element-ui';
const service = {
  state: {
    getfuwindex_on: [true, false, false, false], //服务首页高亮
    servTagArr: [], // servType 服务类型，好多地方需要使用
    compName: 'mainService', // 当前的动态组件
    sysEchartsActIndex: '0', // 系统监控echarts 高亮索引
    formLeave: false // 是否处于注册表单页面，防止误操作导致表单白填
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
    },
    SET_sysEchartsActIndex: (state, data) => {
      state.sysEchartsActIndex = data
    },
    SET_formLeave: (state, data) => {
      state.formLeave = data
    },
  },
  actions: {
    // 设置服务类型
    setServTagArr: ({
      commit
    }) => {
      return new Promise((resolve, reject) => {
        // 获取servType ，里面很多地方要用到
        getBaseData({
          group: "servType"
        }).then(res => {
          commit('SET_servTagArr', res)
          resolve(res)
        }).catch(error => {
          reject(error);
        });
      });
    }
  },
}

export default service;
