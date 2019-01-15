<template>
  <div class="share-wrap">
    <img class="share-img" src="../../assets/icon-nojoin.png" alt>
    <div class="share-shadow"></div>
    <p class="share-title">{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: "pageException",
  data() {
    return {
      msg: "活动已过期！"
    };
  },
  mounted() {
    this.msg = $util.urlGetQuery("msg");
  },
  methods: {
    invate: function() {}
  }
};
</script>

<style lang="less" scoped >
@import "./index";
</style>
