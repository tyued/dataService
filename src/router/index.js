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
        redirect: 'generalization',
        name: '概览',
        hidden: true,
        children: [{
            path: 'generalization',
            component: _import('basics/generalization/index')
        }, {
            path: 'notice',
            name: 'notice', // 通知页
            component: _import('basics/notice/index'),
        }, {
            path: 'monitor',
            name: 'monitor',
            redirect: '/monitor/main',
            component: _import('basics/monitor/index'),
            children: [
                {
                    path: 'main',
                    component: _import('basics/monitor/systerm/main/index')
                },
                {
                    path: 'detail',
                    component: _import('basics/monitor/systerm/detail/index')
                },
            ]
        }, {
            name: 'setting', // 设置模块
            path: 'setting',
            component: _import('basics/setting/index'),
        }]
    }, {
        path: '/login',
        component: _import('login/index'),
        name: '登录',
        hidden: true,
    }, {
        path: '/service',
        component: Layout,
        hidden: true,
        children: [{
            path: '/',
            component: _import('basics/service/index'),
            name: '服务数据'
        }, {
            path: 'reviewed',
            component: _import('basics/service/reviewed/index'),
            name: '审核'
        }, {
            path: 'management',
            component: _import('basics/service/management/index'),
            name: '管理',
            children: [{
                path: 'subscription',
                component: _import('basics/service/management/subscription/index'),
                name: '已订阅'
            }, {
                path: 'publication',
                component: _import('basics/service/management/publication/index'),
                name: '已发布'
            }, {
                path: 'checked',
                component: _import('basics/service/management/checked/index'),
                name: '待审核'
            }, {
                path: 'forbidden',
                component: _import('basics/service/management/forbidden/index'),
                name: '已禁用'
            }]
        }, {
            path: 'studentinfo',
            component: _import('basics/service/studentinfo/index'),
            name: '学生信息'
        }]
    }]
})
