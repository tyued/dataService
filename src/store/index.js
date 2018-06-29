import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import service from './modules/service';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        app,
        service
    },
    getters
});

export default store