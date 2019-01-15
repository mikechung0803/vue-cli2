import nodeResolve from 'rollup-plugin-node-resolve'     // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel'                             // rollup 的 babel 插件，ES6转ES5
import replace from 'rollup-plugin-replace'                       // 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import commonjs from 'rollup-plugin-commonjs'              // 将非ES6语法的包转为ES6可用
import uglify from 'rollup-plugin-uglify'                              // 压缩包
import json from 'rollup-plugin-json'

const version = process.env.VERSION || require('./package.json').version
const banner =
  '/*!\n' +
  ` * jdsdk v${version}\n` +
  ` * (c) 2018-${new Date().getFullYear()}\n` +
  ' * Released under the MIT License.\n' +
  ' */\n'

// const env = process.env.NODE_ENV
const env = 'production'

const config = {
    input: "src/utils/index.js",
    output: {
        file: "static/js/bundle.min.js",
        format: 'umd',  //  五种输出格式：amd /  es6 / iife / umd / cjs
        name:'$util',  //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
        sourcemap:true,  //生成bundle.map.js文件，方便调试
        banner: banner,
        globals: {
            jquerty: '$' //告诉rollup 全局变量$即是jquery
        }
    },
    external: ['vue', 'vueRouter'], //告诉rollup不要将vue打包，而作为外部依赖
    plugins: [
        json(),
        nodeResolve(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true
            // presets: [ "es2015-rollup" ]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify(env)
        }),
        commonjs(),
        // uglify()
    ]
}

if (env === 'production') {
    config.plugins.push(
        uglify({
            compress: {
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                warnings: false
            },
            output: {
                comments: function(node, comment) {
                    if (comment.type === "comment2") {
                        // multiline comment
                        return /@preserve|@license|Released/i.test(comment.value);
                    }
                    return false;
                }
            }
        })
    )
}

export default config