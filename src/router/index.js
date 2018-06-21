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
        path: '/generalization',
        component: _import('basics/generalization/index')
      }]
    },{
      path: '/service',
      component:  Layout,
      name: '服务',
      hidden: true,
      children: [{
        path: '/service',
        component: _import('basics/service/index'),
        name:'服务数据'
      },{
        path: '/service/reviewed',
        component: _import('basics/service/reviewed/index'),
        name:'审核'
      }, {
        path: '/service/studentinfo',
        component: _import('basics/service/studentinfo/index'),
        name:'学生信息'
      }]
    }
  ]
})
