import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV);

Vue.use(Router)
/* layout */
import Layout from '../views/layout/Layout';

export default new Router({
    routes: [{
        path: '/',
        component: Layout,
        redirect: '/generalization',
        name: '概览',
        hidden: true,
        children: [{
            path: '/generalization',
            component: _import('basics/generalization/index')
        },{
            name: 'notice', // 通知页
            path: '/notice',
            component: _import('basics/notice/index'),
        },{
            name: 'monitor', // 监控模块
            path: '/monitor',
            component: _import('basics/monitor/index'),
        }]
    }, {
        path: '/login',
        component: _import('login/index'),
        name: '登录',
        hidden: true,
    }, {
        path: '/service', // ？怎么就写到这里了
        component: Layout,
        name: '服务',
        hidden: true,
        children: [{
            path: '/service',
            component: _import('basics/service/index'),
            name: '服务数据'
        }, {
            path: '/service/reviewed',
            component: _import('basics/service/reviewed/index'),
            name: '审核'
        }, {
            path: '/service/management',
            component: _import('basics/service/management/index'),
            name: '管理',
            children: [{
                path: '/service/management/subscription',
                component: _import('basics/service/management/subscription/index'),
                name: '已订阅'
            }, {
                path: '/service/management/publication',
                component: _import('basics/service/management/publication/index'),
                name: '已发布'
            }, {
                path: '/service/management/checked',
                component: _import('basics/service/management/checked/index'),
                name: '待审核'
            }, {
                path: '/service/management/forbidden',
                component: _import('basics/service/management/forbidden/index'),
                name: '已禁用'
            }]
        }, {
            path: '/service/studentinfo',
            component: _import('basics/service/studentinfo/index'),
            name: '学生信息'
        }]
    }]
})
