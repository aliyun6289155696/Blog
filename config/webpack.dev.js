const { merge } = require('webpack-merge');
const path = require('path')
const common = require('./webpack.common.js');


module.exports = merge(common, {
  mode: "development", //development|production
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './assets',
    inline: true,
    host: 'localhost',
    port: 8080,
    open: true,
    publicPath: "/",
    // hot: true

  },
});