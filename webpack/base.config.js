const HtmlWebpackPlugin = require('html-webpack-plugin')
var path = require('path')
var BUILD_DIR = path.resolve(__dirname, '../src/public')
var APP_DIR = path.resolve(__dirname, '../src/app')

console.log(APP_DIR)

module.exports = {
  entry: {
    app: APP_DIR + '/Routes.tsx',
    vendor: ['react', 'react-dom']
  },

  devServer: {
    compress: true,
    port: 4000,
    disableHostCheck: true
  },

  output: {
      path: BUILD_DIR,
      filename: 'js/[name].bundle.js',
      publicPath: '/'
  },

  resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: [".ts", ".tsx", ".js", ".json", '.scss', '.css']
  },
  
  module: {
      rules: [
          { 
            test: /\.tsx?$/, 
            loader: "ts-loader" 
          },
          {
            test: /\.less$/,
            loader: 'less-loader' // compiles Less to CSS
          },
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          }
      ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, '../src/app/index.html')}),
  ]

};