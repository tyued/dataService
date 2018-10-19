import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param rightInfoObj
 * @param route
 */
function hasPermission(rightInfoObj, route) {
  if (route.meta && route.meta.right) {
    return Object.keys(rightInfoObj).some(role => route.meta.right.includes(role))
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

const permission = {
  state: {
    isDone: false,
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      // console.log(state.routers)
    },
    SET_ISDONE: (state, bool) => {
      state.isDone = bool
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      let {rightInfoObj } = data
      return new Promise(resolve => {
        let accessedRouters
        accessedRouters = filterAsyncRouter(asyncRouterMap, rightInfoObj)
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ISDONE', true)
        resolve()
      })
    }
  }
}

export default permission
