var path = require('path');
const webpack = require('webpack');

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {test: /\.jison$/, use: [{
        loader: 'jison-loader'
      }]},
      {test: /\.jsx?/, include: APP_DIR, use: 'babel-loader'}
    ]
  },
  resolve: {
    modules: [
      APP_DIR,
      "node_modules"
    ]
  }
};

module.exports = config;
