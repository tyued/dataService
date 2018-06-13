import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)
/* layout */
import Layout from '../views/layout/Layout';

export default new Router({
  routes: [
    {
      path: '/',
      component:  Layout,
      redirect: '/generalization',
      name: '概览',
      hidden: true,
      children: [{
        path: 'generalization',
        component: _import('basics/generalization/index')
      }]
    },
  ]
})
