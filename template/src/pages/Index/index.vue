<template>
    <div class="hello whole-page-view">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <ul>
            <li>
                <a @click="$router.push('/form')">
                Form
                </a>
            </li>
            <li>
                <a @click="$router.push('/media')">
                Media
                </a>
            </li>
            <li>
                <a @click="$router.push('vuex')">
                Vuex
                </a>
            </li>
            <li>
                <a
                href="https://twitter.com/vuejs"
                target="_blank"
                >
                Twitter
                </a>
            </li>
            <br>
            <li>
                <a
                href="http://vuejs-templates.github.io/webpack/"
                target="_blank"
                >
                Docs for This Template
                </a>
            </li>
        </ul>
        <h2>Ecosystem</h2>
        <ul>
            <li>
                <a
                href="http://router.vuejs.org/"
                target="_blank"
                >
                vue-router
                </a>
            </li>
            <li>
                <a
                href="http://vuex.vuejs.org/"
                target="_blank"
                >
                vuex
                </a>
            </li>
            <li>
                <a
                href="http://vue-loader.vuejs.org/"
                target="_blank"
                >
                vue-loader
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
            <li>
                <a
                href="https://github.com/vuejs/awesome-vue"
                target="_blank"
                >
                金晨高秋梓
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'pageIndex',
    data () {
        return {
        msg: 'Welcome to Your Vue.js App'
        }
    },
    mounted () {},
    methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.hello {
    text-align: center;
    padding-top: 120px;
}
h1, h2 {
    font-weight: normal;
}
h1 {
    font-size: 64px;
    margin: 21px auto;
}
h2 {
    font-size: 48px;
    margin: 26px 0;
}
ul {
    list-style-type: none;
    padding: 0;
    font-size: 32px;
}
li {
    margin: 0 10px;
    line-height: 2;
}
a {
    color: #42b983;
    font-family: 'font';
}
</style>
