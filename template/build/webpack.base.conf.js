'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const globalRouterConfig = require('../src/config').globalRouterConfig
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const ENV = process.argv[process.argv.length -1];

// file types & file links
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
}

const tpl = {
  img: '<img src="%s">',
  css: '<link rel="stylesheet" type="text/css" href="%s">',
  js: '<script type="text/javascript" src="%s"></script>'
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

console.log('config.build.ENV：', ENV);

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: () => {
    return {
      vendor: ['./src/utils/initialization.js'],
      app: ['./src/main.js']
    }
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
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
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: './build/compile-replace-loader',
        include: [resolve('src/router')],
        options: {
          regExp: globalRouterConfig.async? globalRouterConfig.syncRegExp: globalRouterConfig.asyncRegExp,
          value: globalRouterConfig.repalceValue
        }
      },
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
      // {
      //   test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      //   loader: 'base64-font-loader'
      // }
    ]
  },
  plugins: [
    // Replace html contents with string or regex patterns
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
            // var url = resources['js']['unify']

            var url = resource[type][file]
            if(url.indexOf('static')>-1){
              try {
                console.log("==1==",fs.statSync(resolve(url)).isFile())
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
