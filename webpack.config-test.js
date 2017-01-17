var nodeExternals = require('webpack-node-externals');

var path = require('path');

var APP_DIR = path.resolve(__dirname, 'test');

const config = {
  target: 'node',
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {test: /\.jison$/, include: [path.resolve(__dirname, 'src')], use: [{
        loader: 'jison-loader'
      }]},
    ]
  },
  resolve: {
    modules: [
      APP_DIR,
      "node_modules"
    ]
  },
  externals: [nodeExternals()]
};

module.exports = config;

