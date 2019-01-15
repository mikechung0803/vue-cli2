// 项目未大到需要mutation-types样板代码，且按照业务逻辑创建模块便于小团队维护
// 样板代码解释：https://www.redux.org.cn/docs/recipes/ReducingBoilerplate.html
// https://vuex.vuejs.org/zh/guide/mutations.html
import Vue from 'vue'
import cart from './modules/cart'
import products from './modules/products'
import createLogger from 'config/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        cart,
        products
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})