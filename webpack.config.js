var path = require('path');
const webpack = require('webpack');

const config = {
  entry: './src/poorcode.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  node: {
    fs: "empty"
  },
  module: {
    rules: [
      {test: /\.jison$/, use: [{
        loader: 'jison-loader'
      }]}
    ]
  },
  resolve: {
    modules: [
      path.join(__dirname, "src"),
      "node_modules"
    ]
  }
};

module.exports = config;
