// import vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
// import {
//   Message,
//   MessageBox
// } from 'element-ui';
function switchRouter(data) { // 有可能权限设置没有首页，所以要 依次判断进行跳转
  if (data['survey-admin']) {
    return '/generalization'
  } else if (data['survey-customer']) {
    return '/customer'
  } else if (data['servs']) {
    return '/service'
  } else if (data['monitor']) {
    return '/monitor/main'
  } else if (data['perms']) {
    return '/right'
  } else if (data['sets']) {
    return '/setting'
  }
}

function phonePlant() { // 根据测试要求 手机端禁止访问 这里要判断是否用手机访问
  const ua = window.navigator.userAgent;

  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/),

    isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),

    isAndroid = ua.match(/(Android)\s+([\d.]+)/),

    isMobile = isIphone || isAndroid;

  //判断
  if (isMobile) {
    window.isPhonePlt = true
  } else {
    window.isPhonePlt = false
  }
}
phonePlant()

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress

  if (to.path === '/login') { 
    // 如果直接访问登录页 如果手机访问alert 否则直接放行
    if (window.isPhonePlt) {
      window.alert('请使用PC访问')
      NProgress.done()
      return
    } else {
      next()
    }
  } else {
    // 如果是访问其他页面，包括跳转，直接输入地址的情况，以及刷新页面的情况
    if (store.getters.token) { // 判断是否有token
      if (!store.getters.isDone) {  // 说明无权限，当前用户没有拉取完异步权限路由表   
        Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRightObj'), store.dispatch("setServTagArr")]).then((resArr) => { // 同时并发请求
          let rightObj = resArr[1]
          store.dispatch('GenerateRoutes', rightObj).then((newRouter) => { // 生成可访问的路由表
            router.addRoutes(newRouter) // 动态添加可访问路由表
            if (to.path === '/') {
              // 只有登录的时候才需要动态加载首页
              next(switchRouter(rightObj))
            } else {
              // 否则为刷新网页
              next({
                ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            }
          })
        })
      } else { //当有用户权限的时候，说明所有可访问路由已生成
        store.commit('SET_formLeave', false) // 将注册表单的状态改为false
        if (to.path === '/') { // 同上
          next(switchRouter(store.getters.rightInfoObj)) // 这里权限对象已存储在vuex中
        } else {
          next()
        }
      }

    } else {
      next('/login') // 没有token先去登录
      NProgress.done() // 结束Progress
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
