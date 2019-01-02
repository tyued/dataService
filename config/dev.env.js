'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '""', // 开发环境下的axios前缀，由于使用了proxy代理，这里设置为空
  APP_ORIGIN: '"http://192.168.0.49"' // 

  // 'http://192.168.0.111:8083', 
  // 'http://192.168.0.49',
  // 'localhost:8083',
})
