<template>
  <div class="dialog-wrap" @touchmove.prevent v-if="visible">
    <div class="dialog">
      <h3 class="dialog-title">
        {{title}}
        <span @click="toggleDialog" class="close"></span>
      </h3>
      <div ref="wrapper" class="dialog-con">
        <div class="con" v-html="content"></div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 兼容滑动功能的弹窗组件，常用于展示规则,已挂载再Vue上，可直接使用
 * @example this.$dialog(title, content);
 * @module Dialog
 */
import BScroll from "better-scroll";
export default {
  name: "Dialog",
  /**
   * data
   * @prop {Boolean} visible 是否显示该弹窗
   * @prop {String} title 弹窗页头
   * @prop {String} content 弹窗内容
   */
  data() {
    return {
      visible: false,
      title: '',
      content: ''
    };
  },
  methods: {
    /**
     * @function toggleDialog
     * @description 动态设置弹窗内容，需在父组件写入
     * @param {String} title 页头
     * @param {String} content 内容，支持html片段
     * @example <Dialog ref="dialog" />
     * this.$refs.dialog.toggleDialog(title, content);
     */
    toggleDialog: function(title, content) {
      this.visible = !this.visible;
      this.title = title || '';
      this.content = content || '';
    }
  },
  watch: {
    visible: function(newVal, oldVal) {
      this.$nextTick(function() {
        if (this.visible) {
          this.scroll = new BScroll(this.$refs.wrapper);
        } else {
          this.scroll.destroy();
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped >
@import "./Dialog";
</style>
