const common = require('./webpack.common');
const { merge } = require('webpack-merge');
// const TerserPlugin = require("terser-webpack-plugin");


module.exports = merge(common, {
  mode: "production", //development|production
  //排除 例外规则 指定某些模块不打包
  externals: {
    jquery: 'jQuery',
    // axios: 'axios',
    // wangeditor: 'wangEditor'
  },
})