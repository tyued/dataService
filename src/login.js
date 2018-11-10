// import vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (to.path === '/login') {
    next()
  } else {
    if (store.getters.token) {
      if (!store.getters.isDone) { // 判断当前用户是否已拉取完user_info信息     
        Promise.all([store.dispatch('getUserInfo'), store.dispatch("setServTagArr")]).then((resArr) => {

          // const rightInfoObj = store.getters.rightInfoObj;
          const rightInfoObj = JSON.parse(window.sessionStorage.getItem('rightInfoObj'));

          store.dispatch('GenerateRoutes', {
            rightInfoObj
          }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ 
              ...to,
              replace: true
            }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        })
      } else {
        next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
      next()
    } else {
      next('/login')
      NProgress.done() // 结束Progress
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
