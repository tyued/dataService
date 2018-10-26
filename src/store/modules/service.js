const service = {
    state:{
        getfuwindex_on: [true, false, false, false],       //服务首页
    },
    mutations:{
        SET_fuwindex_on: (state, data) => {
            state.getfuwindex_on = data;
        },
    },
    actions:{
        GET_fuwindex_on: ({ commit }, data) => {
            commit('SET_fuwindex_on', data)
        }
    },
}

export default service;