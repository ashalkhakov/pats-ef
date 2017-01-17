var path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var BUILD_DIR = path.resolve(__dirname, 'dist');
var APP_DIR = path.resolve(__dirname, 'src');

const config = {
  entry: {
    app: [APP_DIR + '/index.jsx']
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
    publicPath: "/dist/"
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {test: /\.jison$/, use: [{
        loader: 'jison-loader'
      }]},
      {test: /\.jsx?/, include: APP_DIR, use: 'babel-loader'},
      {test: /\.css$/, include: APP_DIR,
       loader: ExtractTextPlugin.extract({fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap',
                                          publicPath: '../'})}
    ]
  },
  resolve: {
    modules: [
      APP_DIR,
      "node_modules"
    ]
  },
  plugins: [
    new ExtractTextPlugin('tree.css')
  ]
};

module.exports = config;
