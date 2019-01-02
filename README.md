# dataservice

> vue-cli2 webpack4 vuex sass axios element-ui

## Build Setup

``` bash
# install dependencies
npm install --registry=https://registry.npm.taobao.org

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### 目录结构

```
dataservice
├── package.json                    引入了font-awesome图标库
├── index.html                      引入了jquery和不需要打包的css
├── static                          静态资源目录，不会被webpack处理
│   └── css
│       └── dataServics.css         覆盖element-ui默认样式
├── build                          
│   └── webpack.base.conf.js        webpack基础配置
├── config                         
│   └── index.js                    配置代理
└── src                            
    ├── api                         请求层
    ├── assets                      会被webpack处理的资源文件
    ├── components                  抽离的公共组件
    │   ├── AreaChart               区域echarts
    │   ├── LineChart               线型echarts
    │   ├── PageBar                 封装的分页组件
    │   ├── DatePicker              封装的日期按钮搜索组件
    │   └── ActiveBtn.vue           封装的按钮高亮组件
    ├── router                      路由
    ├── store                       vuex
    │   └── modules                 
    │       ├── login.js            登录及权限处理模块
    │       ├── permission.js       权限路由表处理模块
    │       └── service.js          其他
    ├── styles                        
    ├── utils                       工具
    │   ├── base64.js               base64加密
    │   ├── fetch.js                封装axios、axios配置、请求响应拦截器
    │   ├── formatData.js           
    │   ├── handleToken.js          处理token到cookie中
    │   ├── index.js                基础工具
    │   └── rules.js                element-ui 自定义表单验证处理函数
    ├── views                       视图层             
    │   ├── 404                     404页面（暂时没用，可以的路由表最下面配置） 
    │   ├── login                   登录页 
    │   ├── layout                  主体模块
    │   └── basics                  内容模块
    │       ├── application         我的应用
    │       ├── customer            用户首页
    │       ├── generalization      管理员首页
    │       ├── monitor             监控
    │       ├── notice              通知（点击铃铛进入）
    │       ├── right               权限
    │       ├── service             服务
    │       │   ├── dataService     数据源
    │       │   ├── mainService     服务首页
    │       │   ├── management      服务管理
    │       │   ├── register        服务注册
    │       │   │   ├── index.vue   新的注册
    │       │   │   └── edit.vue    未提交审核的注册表单编辑
    │       │   └── index.vue       服务父模块
    │       ├── serviceinfo         查看单个服务
    │       └── setting             设置
    ├── App.vue                     根组件
    ├── login.js                    登录逻辑
    └── main.js                     入口  
```

### 写在之前

- 开发模式下使用服务器代理防止跨域
``` javascript
// config/index.js
proxyTable: {
  '/dsb':{
    target: 'http://192.168.0.49',
    changeOrigin: true,
    pathRewrite: {
      '^/dsb': '/dsb'
    }
  }
}
```

- 配置axios基础路径
`config/[name].env.js` 中的`BASE_API`
对应`utils/fetch.js`里面的`process.env.BASE_API`

- axios 请求
``` javascript
import fetch from 'utils/fetch';
// xxx
export function fnName(obj) { // 传入参数对象，key为参数名
  return fetch({
    url: '/dsb/admin/service/registry/rest',
    method: 'post',
    data: obj, // data 会将参数对象放入请求体
    params: obj, // params 会将参数对象拼接到URL后面(query形式)
  });
}
```

### 注意事项

- 静态资源放置在src/assets下面，可以被webpack压缩处理
- static/css/dataService.css 覆盖element默认样式（因为没有被vue-loader处理不会有data-自定义属性）注意添加父类名来防止造成全局css污染
- 每个页面style标签添加scoped
- 会复用的模块模块化
- 以接口的数据格式为data，防止来回处理数据
- 表单必有编辑，注意清空和还原逻辑


### 如何继续开发

- router 添加路由
- 添加对应的页面目录
- 配置layout/Sidebar.vue侧边导航
- 调整login.js页面跳转函数