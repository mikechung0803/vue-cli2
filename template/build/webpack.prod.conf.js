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

// index.html页特定注释被替换成相应的script的映射配置
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

// 转换绝对地址
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const env = require('../config/prod.env'),
      // css、scss、sass、less、stylus、styl、px2rem规则
      rules = [...utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      })],
      // 忽略拷贝 /static/js 下的特定文件配置项
      copyJsIngore =  ['*.map', 'less.min.js'];

// 如果使用外链bundle则抹掉import的代码，如果不使用则抹除index.html的script及打包拷贝文件
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

// 如果使用外链vue、vuex、vue-router则打包剥离，如果不使用则不加入index.html的script及打包拷贝文件
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
    filename: utils.assetsPath('js/[name].js'), // name为entry入口key值
    // 默认为[id].[chunkhash].js，即0.[chunkhash].js……配合vue-router懒加载可以设置chunkName，还可设置相同chunkName打包到一起
    chunkFilename: utils.assetsPath('js/[id].[name].js')
  },
  // 剥离的依赖代码块
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
      // .map文件记录了压缩丑化后的代码映射信息，报错可以追溯到源文件
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // 将js中引入的css分离的插件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true, // 当使用 `CommonsChunkPlugin` 并且在公共chunk中有提取的chunk时，allChunks必须设置为true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 压缩提取出的css，并解决ExtractTextPlugin分离出的js重复问题(多个文件引入同一css文件)
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index, // 用于生成的HTML文件的名称，默认是index.html。你可以在这里指定子目录（例如:assets/admin.html）
      template: 'index.html', // 模板的路径。支持加载器，例如 html!./index.html
      inject: true, // 注入的js文件将会被放在body标签中,当值为'head'时，将被放在head标签中
      minify: {
        removeComments: true, // 删除html中的注释代码
        collapseWhitespace: true,  // 删除html中的空白符
        removeAttributeQuotes: true  // 删除html元素中属性的引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // 替换index.html中特定的注释信息
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
    // 分离公共js到vendor中
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', // 文件名
      minChunks (module) {
        // 所有node_modules里的模块打包到当前文件里
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // 上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
    // 下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
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

    // 拷贝static文件夹下的资源
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static', 'js'),
        to: path.resolve(config.build.assetsRoot, config.build.assetsSubDirectory, 'js'),
        ignore: copyJsIngore // 忽略拷贝的文件
      },
      {
        from: path.resolve(__dirname, '../static', 'css'),
        to: path.resolve(config.build.assetsRoot, config.build.assetsSubDirectory, 'css'),
        ignore: ['.*']
      }
    ])
  ]
})
// 配置文件开启了gzip压缩
if (config.build.productionGzip) {
  // 引入压缩文件的组件,该插件会对生成的文件进行压缩，生成一个.gz文件
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', // 目标文件名
      algorithm: 'gzip', // 使用gzip压缩
      test: new RegExp( // 满足正则表达式的文件会被压缩
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, // 资源文件大于10240B=10kB时会被压缩
      minRatio: 0.8 // 最小压缩比达到0.8时才会被压缩
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
