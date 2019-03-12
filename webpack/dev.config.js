const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base.config.js')

module.exports = merge(baseConfig, {

  devServer: {
    compress: true,
    port: 4000,
    disableHostCheck: true
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.baseUrl':  "'http://localhost:3005/wadmin'"
    }),
  ]

})