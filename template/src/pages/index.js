import Index from './Index/index.vue'
import Form from './Form/index.vue'
import Media from './Media/index.vue'
{{#vuex}}
import Vuex from './Vuex/index.vue'
{{/vuex}}
import Exception from './Exception/index.vue'

export {
    Index,
    Form,
    Media,
    {{#vuex}}
    Vuex,
    {{/vuex}}
    Exception
}