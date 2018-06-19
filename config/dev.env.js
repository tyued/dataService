'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.96.114.14:8083"',
  APP_ORIGIN: '"http://47.96.114.14:8083"'
})
