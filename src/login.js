// import vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress
  if (to.path === '/login') {
    next()
  } else {
    // next()
    if (store.getters.token) {
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