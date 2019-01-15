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
<style scoped>
.hello {
  text-align: center;
  padding-top: 1.2rem;
}
h1, h2 {
  font-weight: normal;
}
h1 {
  font-size: 0.64rem;
  margin: 0.21rem auto;
}
h2 {
  font-size: 0.48rem;
  margin: 0.26rem 0;
}
ul {
  list-style-type: none;
  padding: 0;
  font-size: 0.32rem;
}
li {
  margin: 0 10px;
  line-height: 2;
}
a {
  color: #42b983;
  font-family: 'font'
}
</style>
