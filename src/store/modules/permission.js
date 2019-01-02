import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param rightInfoObj
 * @param route
 */
function hasPermission(rightInfoObj, route) { // 通过声明的meta属性来比对后台返回的权限
  if (route.meta && route.meta.right) {
    return Object.keys(rightInfoObj).some(role => route.meta.right.includes(role)) // 只要包含就证明该权限为真
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param rightInfoObj
 */
function filterAsyncRouter(routes, rightInfoObj) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(rightInfoObj, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, rightInfoObj)
      }
      res.push(tmp)
    }
  })
  return res
}

// function filterRouter(router, asyncRouter) { // 尝试去重路由表，但是失败了。。。
//   router.forEach((a) => {
//     asyncRouter.forEach((b, idx) => {
//       if (a.name === b.name) {
//         a.children = a.children.concat(b.children)
//         asyncRouter.splice(idx, 1)
//       }
//     })
//   })
//   return router.concat(asyncRouter)
// }

const permission = {
  state: {
    isDone: false, // 是否处理完毕
    routers: constantRouterMap, // 原始路由表
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = constantRouterMap.concat(routers) // 拼接两个路由
      // state.routers = filterRouter(constantRouterMap, routers)
    },
    SET_ISDONE: (state, bool) => {
      state.isDone = bool
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, rightInfoObj) {
      return new Promise(resolve => {
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, rightInfoObj)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ISDONE', true) // 处理完成
        resolve(accessedRouters)
      })
    }
  }
}

export default permission
