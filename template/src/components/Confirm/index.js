import Vue from 'vue'
import Confirm from './Confirm.vue'

const ConfirmBox = Vue.extend(Confirm)

Confirm.install = function (options, type) {
    if (options === undefined || options === null) {
        options = {
            title: '',
            content: ''
        }
    } else if (typeof options === 'string' || typeof options === 'number') {
        options = {
            content: options
        }
        if (type != undefined && options != null) {
            options.type = type;
        }
    }
    return new Promise((resolve, reject) => {
        let instance = new ConfirmBox({
            data: options,
            methods: {
                handleOk() {
                    instance.visible = false;
                    resolve();
                },
                handleCancel() {
                    instance.visible = false;
                    reject();
                }
            }
        }).$mount()

        document.body.appendChild(instance.$el)

        Vue.nextTick(() => {
            instance.visible = true
        })
    })
}

export default Confirm