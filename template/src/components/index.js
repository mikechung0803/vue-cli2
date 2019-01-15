/**
 * @description 组件
 * @module components
 */
{{#if_eq cssLoader "less"}}
import 'style/global.less'
{{/if_eq}}
{{#if_eq cssLoader "scss"}}
import 'style/global.scss'
{{/if_eq}}
import 'modules/jelly/jelly.js'
import 'modules/jelly/jelly.css'
import VueLazyLoad from 'vue-lazyload'
import VueClipboards from 'vue-clipboards'
import mixin from 'modules/mixin'
import Ping from 'modules/Ping'
import Service from 'service'
import Dialog from '@/components/Dialog'
import ShareGuide from '@/components/ShareGuide/ShareGuide'
import Toast from '@/components/Toast'
import Confirm from '@/components/Confirm'

const components = [
    Dialog,
    ShareGuide,
    Toast,
    Confirm
]

const install = (Vue) => {
    components.forEach(component => {
        Vue.component(component.name, component);
    });

    Vue.mixin(mixin)
    Vue.filter('currency', $util.currency)
    /**
     * @description 图片懒加载功能
     * 原理：图片设定宽高占位，自定义属性设置图片地址，当滚动到特定距离时赋值给src属性即可，如需要渐变效果可添加css的transition属性
     * @example :v-lazy="{String}" :key="绝对唯一值，多列不可用纯序号否则多列key值重复还是不会更新图片"
     */
    Vue.use(VueLazyLoad)
    /**
     * @description 拷贝功能，实现原理为execCommand：https://developer.mozilla.org/zh-CN/docs/Web/API/Document/execCommand
     * @example v-clipboard="{String}" @success="handleSuccess" @error="handleError"
     */
    Vue.use(VueClipboards)
    Vue.config.productionTip = false
    Vue.prototype.$ping = Ping
    Vue.prototype.$service = Service
    Vue.prototype.$toast = Toast.install
    Vue.prototype.$confirm = Confirm.install
    Vue.prototype.$dialog = Dialog.install
}
export default install