'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '""',
  APP_ORIGIN: '"http://192.168.0.49"'

  // 'http://192.168.0.111:8083',
  // 'http://192.168.0.49',
  // 'localhost:8083',
})
