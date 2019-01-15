'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const globalRouterConfig = require('../src/config').globalRouterConfig
const ENV = process.argv[process.argv.length -1]

console.log('dev config.build.ENV：', ENV);

// file types & file links
const resource = {
  js: {
    vue: 'js/vue.min.js',
    'vue-router': 'js/vue-router.min.js',
    vuex: 'js/vuex.min.js'
  }
},
tpl = {
  img: '<img src="%s">',
  css: '<link rel="stylesheet" type="text/css" href="%s">',
  js: '<script type="text/javascript" src="%s"></script>'
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const env = require('../config/prod.env'),
      rules = [...utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })],
      copyJsIngore =  ['*.map', 'less.min.js'];

if (globalRouterConfig.bundle) {
  rules.push({
    test: /\.js$/,
    loader: './build/compile-replace-loader',
    include: [resolve('src/router')],
    options: {
      regExp: globalRouterConfig.bundleRegExp,
      value: ''
    }
  })
} else {
  copyJsIngore.push('bundle.min.js');
}

if (config.build.vueExternal) {
  rules.push({
    test: /\.js$/,
    loader: './build/compile-replace-loader',
    include: [resolve('src/router')],
    options: {
      regExp: globalRouterConfig.vuexRegExp,
      value: ''
    }
  })
} else {
  copyJsIngore.push('vue.min.js')
  copyJsIngore.push('vue-router.min.js')
  copyJsIngore.push('vuex.min.js')
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: rules
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js')
  },
  externals: config.build.vueExternal ? config.build.vueExternals : {},
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env,
      ENV: JSON.stringify(ENV) || ''
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false, // 去除warning警告
          drop_debugger: true, // 发布时去除debugger语句
          drop_console: true, // 发布时去除console语句
          pure_funcs: ['console.log'], // 配置发布时，不被打包的函数
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // Replace html contents with string or regex patterns
    new HtmlReplaceWebpackPlugin([
      {
        pattern: 'static/',
        replacement: ''
      },
      {
        pattern: /(<!--\s*|@@)(css|js|img):([\w-\/]+)(\s*-->)?/g,
        replacement: function(match, $1, type, file, $4, index, input) {
          if(resource[type][file]) {
            // those formal parameters could be:
            // match: <-- js:unify -->
            // type: js
            // file: unify
            // Then fetch js script from some resource object
            // var url = resources['js']['unify']
            if(!config.build.vueExternal && (file.indexOf('vue') > -1)) {
              return match 
            }else {
              var url = resource[type][file]
              return $4 == undefined ? url : tpl[type].replace('%s', url)
            }
          } else {
            return match
          }
        }
      }
    ]),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static', 'js'),
        to: path.resolve(config.build.assetsRoot, config.build.assetsSubDirectory, 'js'),
        ignore: copyJsIngore
      },
      {
        from: path.resolve(__dirname, '../static', 'css'),
        to: path.resolve(config.build.assetsRoot, config.build.assetsSubDirectory, 'css'),
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
