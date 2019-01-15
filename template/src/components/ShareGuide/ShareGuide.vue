<template>
    <section class="share-guide" v-show="isShow" @click="toggleShare">
        <img v-if="isWeixin || isQQ || isWeibo" src="../../assets/share-guide.png" alt="">
        <div class="share-text" v-else><div>请复制链接</div><div>去微信里分享吧</div></div>
    </section>
</template>
<script>
export default {
    name: "ShareGuide",
    data() {
        return {
            isShow: false,
            isWeibo: /WeiBo/i.test(navigator.userAgent)
        }
    },
    computed: {
        isWeixin: function() {
            return $util.isWeixin()
        },
        isQQ: function() {
            return $util.isQQ()
        }
    },
    methods: {
        toggleShare: function() {
            this.isShow = !this.isShow;
        }
    }
}
</script>

<style lang="less" scoped>
@import './ShareGuide';
</style>
