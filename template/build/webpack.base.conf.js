'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const globalRouterConfig = require('../src/config').globalRouterConfig
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const ENV = process.argv[process.argv.length -1];

// index.html页在非local环境下注释会被替换成相应的script
const resource = {
  js: {
    unify: '//wl.jd.com/unify.min.js',
    jssdk: 'static/js/jssdk.min.js',
    bundle: 'static/js/bundle.min.js',
    // downloadAppPlugIn: "//st.360buyimg.com/m/js/2014/module/plugIn/downloadAppPlugIn_imk2.js",
    // jdwebm: "//h5.360buyimg.com/ws_js/jdwebm.js?v=STP1",
    // 'gia-html': "//gia.jd.com/m.html",
    // 'gia-js': "//gias.jd.com/js/m.js"
  }
},
tpl = {
  img: '<img src="%s">',
  css: '<link rel="stylesheet" type="text/css" href="%s">',
  js: '<script type="text/javascript" src="%s"></script>'
}

// 返回绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

console.log('config.build.ENV：', ENV);

module.exports = {
  // 根路径
  context: path.resolve(__dirname, '../'),
  // 入口，key作为ouput打包文件名，value可以是字符串、数组、函数
  entry: () => {
    return {
      vendor: ['./src/utils/initialization.js'],
      app: ['./src/main.js']
    }
  },
  // 输入配置，name为entry的key值
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    // 生产模式或开发模式下html、js等文件内部引用的公共路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
   // 自动解析确定的拓展名,使导入模块时不带拓展名，alias创建import或require的别名
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'components': resolve('src/components'),
      'config': resolve('src/config'),
      'service': resolve('src/service'),
      'modules': resolve('src/modules'),
      'utils': resolve('src/utils'),
      'style': resolve('src/style')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // 初始配置为include相关文件导致打包还存在es6语言，需改成exclude配置项
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // 编译前将制定import代码抹除掉，剥离打包依赖
      {
        test: /\.js$/,
        loader: './build/compile-replace-loader',
        include: [resolve('src/router')],
        options: {
          regExp: globalRouterConfig.async? globalRouterConfig.syncRegExp: globalRouterConfig.asyncRegExp,
          value: globalRouterConfig.repalceValue
        }
      },
      /**
       * 图片、视频、字体配置
       * limit=10000 ： 10kb
       * 图片大小小于10kb 采用内联的形式，否则输出图片
       */
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      },
      // 将字体依赖转换成base64，如果字体较多会使app.css打包体积较大，慎用
      // {
      //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      //   loader: 'base64-font-loader'
      // }
    ]
  },
  plugins: [
    // 替换index.html的特定注释代码为script、css、img
    new HtmlReplaceWebpackPlugin([
      {
        pattern: /(<!--\s*|@@)(css|js|img):([\w-\/]+)(\s*-->)?/g,
        replacement: function(match, $1, type, file, $4, index, input) {
          if(process.argv[process.argv.length -1].indexOf('local')==-1 && resource[type][file]) {
            // those formal parameters could be:
            // match: <-- js:unify -->
            // type: js
            // file: unify
            // Then fetch js script from some resource object
            // var url = resources['js']['unify'] = '//wl.jd.com/unify.min.js'
            // tpl[type].replace('%s', url) = <script src="//wl.jd.com/unify.min.js"></script>

            var url = resource[type][file]
            if(url.indexOf('static')>-1) {
              try {
                if(fs.statSync(resolve(url)).isFile()){
                  return $4 == undefined ? url : tpl[type].replace('%s', url)
                }else{
                  return match
                }
              } catch (err) {
                if (err.code !== "ENOENT") return match;
              }
            }else {
              return $4 == undefined ? url : tpl[type].replace('%s', url)
            }
          }else {
            return match
          }
        }
      }
    ])
  ],
  // 以下选项是Node.js全局变量或模块，这里主要是防止webpack注入一些Node.js的东西到vue中 
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
