<template>
  <div id="app">
    {{#router}}
		<transition name="router-fade" mode="out-in">
			<keep-alive exlude="">
			    <router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
    </transition>
    <transition name="router-fade" mode="out-in">
			<router-view v-if="!$route.meta.keepAlive"></router-view>
		</transition>
    {{else}}
    <ShareGuide />
    {{/router}}
  </div>
</template>

<script>
{{#unless router}}
import ShareGuide from 'components/ShareGuide/ShareGuide'

{{/unless}}
export default {
  name: 'App'{{#router}}{{else}},
  components: {
    ShareGuide
  }{{/router}}
}
</script>

<style lang="less">
#app {
  width: 100%;
  min-height: 100%;
  margin: 0 auto;
  overflow: scroll;
}
.router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
}
.router-fade-enter, .router-fade-leave-active {
    opacity: 0;
}
</style>
