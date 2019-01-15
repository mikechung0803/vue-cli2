<template>
    <transition name="fade">
        <div v-if="visible">
            <section class="confirm">
                <div class="confirm-body">
                    <p class="confirm-body-maintitle">{{title}}</p>
                    <p class="confirm-body-subtitle">{{content}}</p>
                </div>
                <div class="confirm-footer">
                    <p class="confirm-footer-ok" @click="handleOk">{{confirmButtonText}}</p>
                    <p class="confirm-footer-cancel" @click="handleCancel">{{cancelButtonText}}</p>
                </div>
            </section>
            <div class="confirm-mask"></div>
        </div>
    </transition>
</template>

<script>
/**
 * @description 自定义样式确认框
 * @module Confirm
 * @example this.$confirm({
 * title: "",
 * contetnt: "",
 * confirmButtonText: "",
 * cancelButtonText: "",
 * type: "warning"
 * }).then(
 * //确认
 * ).catch(
 * //取消
 * );
 * @returns {Promise} 确认then，关闭catch
 */
export default {
    name: "Confirm",
    /**
     * data
     * @prop {Boolean} visible 是否显示该弹窗
     * @prop {String} title 弹窗页头
     * @prop {String} content 弹窗内容
     * @prop {String} confirmButtonText 确认按钮文案
     * @prop {String} cancelButtonText 关闭按钮文案
     * @prop {String} type icon类型，可设置success、warning
     */
    data() {
        return {
        visible: false,
        title: '',
        content: '',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        }
    },
    mounted(){

    },
    methods: {
        /**
         * @function handleOk
         * @description 托底确认函数，仅关闭确认框
         */
        handleOk() {
            this.visible = false;
        },
        /**
         * @function handleCancel
         * @description 托底关闭函数，仅关闭确认框
         */
        handleCancel() {
            this.visible = false;
        }
    }
}
</script>

<style lang="less" scoped>
    @import "./Confirm";
</style>