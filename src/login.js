// import vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
  Message,
  MessageBox
} from 'element-ui';
function switchRouter(data) { // 依次判断进行跳转
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

function phonePlant() {
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
    if (window.isPhonePlt) {
      window.alert('请使用PC访问')
      NProgress.done()
      return
    } else {
      next()
    }
  } else {
    if (store.getters.token) {

      if (!store.getters.isDone) {  // 无权限时 判断当前用户是否已拉取完异步权限路由表   
        Promise.all([store.dispatch('getUserInfo'), store.dispatch('getRightObj'), store.dispatch("setServTagArr")]).then((resArr) => {
          let rightObj = resArr[1]
          store.dispatch('GenerateRoutes', rightObj).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
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
        store.commit('SET_formLeave', false)
        if (to.path === '/') {
          next(switchRouter(store.getters.rightInfoObj))
        } else {
          next()
        }
      }

    } else {
      next('/login')
      NProgress.done() // 结束Progress
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
