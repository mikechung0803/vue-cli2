/**
 * @module router
 * @description 路由配置页面
 * @description 通天塔里资源必需有绝对地址或包含在index.html文件夹里才能被访问到，所以路由异步加载无效
 */
import Vue from 'vue'
import Router from 'vue-router'
import {globalRouterConfig} from '@/config'
{{#vuex}}
//vuex
import Vuex from 'vuex'
window.Vuex = Vuex
//vuex
{{/vuex}}

//bundle
if(!globalRouterConfig.bundle){
  window.$util = require('utils').default
}
//bundle

//router-sync
var Pages = require('@/pages'),
    Index = Pages.Index,
    Form  = Pages.Form,
    Media = Pages.Media,
    {{#vuex}}
    Store = Pages.Vuex,
    {{/vuex}}
    Exception = Pages.Exception;
//router-sync

//router-async
// var Index = () => import(/* webpackChunkName: "Index" */ '@/pages/Index') // es6方案
var Index = resolve => require.ensure([], () => resolve(require('@/pages/Index/index.vue')), 'Index'), // webpack方案，ensure第一个数组为依赖文件
    Form = resolve => require.ensure([], () => resolve(require('@/pages/Form')), 'Form'),
    Media = resolve => require.ensure([], () => resolve(require('@/pages/Media')), 'Media'),
    {{#vuex}}
    Store = resolve => require.ensure([], () => resolve(require('@/pages/Vuex')), 'Vuex'),
    {{/vuex}}
    Exception = resolve => require.ensure([], () => resolve(require('@/pages/Exception')), 'Exception')
//router-async

Vue.use(Router)

export default new Router({
  mode: globalRouterConfig.mode || 'hash',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      beforeEnter: (to, from, next) => {
        // 通过hash符号替换成其它特定值再替换回来，解决微信分享无法保留hash信息的问题
        let url = location.href;
        let hashChangeReg = /\?/gi;
        if (url.match(hashChangeReg) && url.match(hashChangeReg).length >=2 && url.indexOf('jdhash') > -1) {
            url = url.replace('#/', '');
            location.replace(url.replace('jdhash', '#/'));
        } else {
            next();
        }
      }
    },
    {
      path: '/form',
      name: 'Form',
      component: Form
    },
    {
      path: '/media',
      name: 'Media',
      component: Media
    },
    {{#vuex}}
    {
      path: '/vuex',
      name: 'Store',
      component: Store
    },
    {{/vuex}}
    {
      path: '/exception',
      name: 'Exception',
      component: Exception
    }
  ]
})
