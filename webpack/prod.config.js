const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = merge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.baseUrl':  "'https://xunddev.nextleap.io/wadmin'"
    }),
  ]
})