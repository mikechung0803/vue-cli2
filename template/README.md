# {{ name }}

> {{ description }}

## Build Setup

``` bash
# 安装依赖，建议npm i -g cnpm，再执行cnpm install加快速度
cnpm install

# 本地启动项目，调用预发接口
npm run dev

# 本地启动项目，调用.js的mock接口，url为static/mock/${functionId}.js，js可以自行添加随机值逻辑
npm run mock

# 本地启动项目，调用.js的mock接口，url为static/mock/${functionId}.js，js可以自行添加随机值逻辑，同时index.html的script注释不替换成script标签，适合脱网环境下开发
npm run local

# 本地启动项目，调用正式接口
npm run prod

# font-spider字蛛提取font.html内的自定义字体减小体积，再将ttf转成base64保存在以字体文件名命名的css里
npm run font

# 提取README.md为首页，src文件夹内的.js文件注释生成MarkDown文档
npm run jsdoc

# 提取README.md为HOME，src文件夹内的.vue文件注释生成MarkDown文档
npm run vuedoc

# 将utils打包成js库，所有方法挂载再window.$util下
npm run bundle

# 打包成适用线上环境的压缩代码，比如接口为api.m.jd.com
npm run build

# 打包成适用预发环境的压缩代码，比如接口为beta-api.m.jd.com
npm run build-beta

# build for production and view the bundle analyzer report
npm run build --report
{{#unit}}

# run unit tests
npm run unit
{{/unit}}
{{#e2e}}

# run e2e tests
npm run e2e
{{/e2e}}
{{#if_or unit e2e}}

# run all tests
npm test
{{/if_or}}
```
JSDoc中文文档
https://www.css88.com/doc/jsdoc/index.html 

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
