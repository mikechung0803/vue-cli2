<template>
    <transition name="fade">
        <section class="toast-wrapper" v-if="visible">
            <div class="icon" v-if="type">
                <i :class="'icon-'+type"></i>
            </div>
            <div class="desc" v-html="content"></div>
        </section>
    </transition>
</template>

<script>
/**
 * 自定义样式Toast
 * @example this.$toast(content);
 * @example this.$toast({
 * content: "",
 * time: "",
 * type: ""
 * });
 * @module Toast
 */
export default {
    name: "Toast",
    /**
     * data
     * @prop {Boolean} visible 是否显示该弹窗
     * @prop {String} content 弹窗内容
     * @prop {Number} time 延迟关闭时间
     * @prop {String} type icon类型，可设置success、warning
     */
    data() {
        return {
            content: '',
            time: 2000,
            visible: false,
            type: 'success', //wanring
        }
    },
    mounted() {
        this.close()
    },
    methods: {
        /**
         * @function close
         * @description 延迟关闭函数，mounted执行，无需手动执行
         */
        close() {
            setTimeout(() =>{
                this.visible = false
            }, this.time);
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./Toast";
</style>