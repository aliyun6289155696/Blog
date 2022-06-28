const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const webpack = require('webpack')

module.exports = {
  target: 'web',          //管理node服务端项目的时候 改为 node
  // 入口
  entry: {
    main: './app/main.js',
  },
  // 输出
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].build.js',
  },
  // 加载器
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.hbs$/i,
        use: [
          'handlebars-loader'
        ]
      }
    ]
  },
  // 插件
  plugins: [
    new webpack.optimize.SplitChunksPlugin(),
    // new BundleAnalyzerPlugin(),                 //展示模块依赖关系大小
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'myBlog',
    })
  ],
  //解析
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, '../src/util/'),
      hbs: path.resolve(__dirname, '../src/views')
    },
    //第三方模块解析来源
    modules: ['node_modules'],
    //解析 模块后缀默认 ext
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  },
  // 提取多入口模块中的第三方库 单独整合打包
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        }
      }
    }
  }
  //开发环境下 保留源码map 方便debug
  // devtool: 'source-map'
  // devServer: {
  //   contentBase: path.join(__dirname, '/dist/'),
  //   inline: true,
  //   host: 'localhost',
  //   port: 8080,
  //   open: true
  // }
}