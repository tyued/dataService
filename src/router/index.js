import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)
/* layout */
import Layout from '../views/layout/Layout';

export const constantRouterMap = [{
  path: '/',
  component: Layout,
  redirect: 'generalization',
  name: '概览',
  children: [{
    path: '/notice',
    name: 'notice', // 通知页
    component: _import('basics/notice/index'),
  }, {
    path: '/application',
    name: 'application', // 应用页
    component: _import('basics/application/index'),
  }, {
    path: '/monitor',
    name: 'monitor',
    redirect: '/monitor/main',
    component: _import('basics/monitor/index'),
    children: [{
      path: 'main',
      component: _import('basics/monitor/systerm/main/index'),
    }, {
      path: 'detail',
      component: _import('basics/monitor/systerm/detail/index'),
    }]
  }]
}, {
  path: '/login',
  component: _import('login/index'),
  name: '登录',
}, {
  path: '/404',
  component: _import('404/index'),
}]


//实例化vue的时候只挂载constantRouter
export default new Router({
  routes: constantRouterMap
})


//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRouterMap = [{
  path: '/',
  component: Layout,
  redirect: 'generalization',
  name: '概览',
  meta: {
    right: ['serv-home']
  },
  children: [{
    path: 'generalization', // 概览模块
    component: _import('basics/generalization/index'),
    meta: {
      right: ['serv-home']
    }
  }, {
    name: 'right', // 权限模块
    path: 'right',
    component: _import('basics/right/index'),
    meta: {
      right: ['perms']
    }
  }, {
    name: 'setting', // 设置模块
    path: 'setting',
    component: _import('basics/setting/index'),
    meta: {
      right: ['sets']
    }
  }, {
    name: 'service', // 服务模块
    path: 'service',
    component: _import('basics/service/index'),
    meta: {
      right: ['servs']
    }
  }, {
    name: 'serviceinfo',
    path: 'serviceinfo',
    component: _import('basics/serviceinfo/index'),
    meta: {
      right: ['servs']
    },
  }]
}, {
  path: '*',
  redirect: '/404',
}];
