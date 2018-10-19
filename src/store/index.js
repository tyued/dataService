import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import service from './modules/service';
import login from './modules/login';
import permission from './modules/permission';
import getters from './getters';
Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        login,
        service,
        permission,
    },
    getters
});

export default store