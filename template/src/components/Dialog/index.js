import Vue from 'vue'
import Dialog from './Dialog.vue'

const DialogBox = Vue.extend(Dialog)

Dialog.install = function (options, type) {
  if (options === undefined || options === null) {
    options = {
        title: '',
        content: ''
    }
  } else if (typeof options === 'string' || typeof options === 'number') {
    options = {
        title: options,
        content: options
    }
    // if (type != undefined && options != null) {
    //   options.type = type;
    // }
  }

  let instance = new DialogBox({
    data: options
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.visible = true
  })
}

export default Dialog