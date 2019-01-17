/**
 * form表单处理
 * @module form
 */

/**
 * @author zhongxianyu
 * @description 去除两边空格
 * @param {String} val 参数
 * @returns {String}
 */
const formTrim = (val) => {
    if(val && typeof val === "string") return val.replace(/^\s+|\s+$/gm, '');
    return val;
}

/**
 * @author zhongxianyu
 * @description 表单校验，对当个输入框校验，用法‘@blur=e=>formValidate(e.target,validator)’
 * @param {HTMLElement} element DOM对象
 * @param {String} element.name DOM对象设置name才会被校验，且于规则对应
 * @param {Object} validator 校验规则对象
 * @param {Boolean} validator.addOverallErrorClass 是否设置全局错误样式
 * @param {String} validator.errorClass 设置全局错误样式，比如加红色边框
 * @param {Function} validator.callback 全局校验错误回调函数，优先级高于局部回调函数
 * @param {Object} validator[element.name]  局部校验规则
 * @param {Boolean} validator[element.name].enableEmoji 默认不支持emoji表情，可局部开启
 * @param {RegExp} validator[element.name].regex 默认无正则校验，设置则开启正则校验
 * @param {Boolean} validator[element.name].addErrorClass 设置局部错误样式，优先级高于全局错误样式
 * @param {String} validator[element.name].errorClass 设置局部错误样式名称
 * @returns {Boolean} 返回true校验无误，false校验失败
 */
const formValidate = (element, validator) => {
    if(!element || !element.name || !validator || typeof validator !== "object"){
        return true
    }
    let key = element.name,
        value = formTrim(element.value),
        addOverallErrorClass = validator.addErrorClass,
        addErrorClass = validator[key].addErrorClass,
        callback = validator.callback || validator[key].callback,
        enableEmoji = validator[key].enableEmoji,
        regex = validator[key].regex,
        errorClass = validator[key].errorClass || validator.errorClass || "errorBorder";//比如给输入框加红色外框.errorBorder{border: 1px solid red !important;border-radius: 4px;}
    if(callback && typeof callback !== "function"){
        alert("callback should be a function");
        return true
    }
    
    //不能输入表情
    let expressionReg = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;

    if(!value && validator[key].required){
        if(addErrorClass!==undefined){
            if(addErrorClass) element.classList.add(errorClass);
        }else if(addOverallErrorClass!==undefined){
            if(addOverallErrorClass) element.classList.add(errorClass);
        }
        if(callback){
            callback()
        }else{
            $j.toast(validator[key].requiredMsg || `${validator[key].label}不能为空`);
        }
        return false;
    }else if(!enableEmoji && expressionReg.test(value)){
        if(addErrorClass!==undefined){
            if(addErrorClass) element.classList.add(errorClass);
        }else if(addOverallErrorClass!==undefined){
            if(addOverallErrorClass) element.classList.add(errorClass);
        }
        if(callback){
            callback()
        }else{
            $j.toast(`不支持输入表情`);
        }
        return false;
    }else if(regex && !validator[key].regex.test(value)){
        if(addErrorClass!==undefined){
            if(addErrorClass) element.classList.add(errorClass);
        }else if(addOverallErrorClass!==undefined){
            if(addOverallErrorClass) element.classList.add(errorClass);
        }
        if(callback){
            callback()
        }else{
            $j.toast(validator[key].errorMsg || `${validator[key].label}格式不正确`);
        }
        return false;
    }
    element.classList.remove(errorClass);
    return true;
}

/**
 * @author zhongxianyu
 * @description 使用递归的方式先序遍历DOM树，再从上至下逐个校验，可校验失败则停止，也可无打断全校验
 * @param {Object} object  包含监听还是立即校验、是否一次性全校验（默认从上到下校验失败即停止）、校验无误回调函数、校验失败回调函数
 * @param {HTMLElement} object.element 根节点
 * @param {Object} object.validator 校验规则，参考formValidate函数
 * @param {Boolean} object.listener 默认不开启监听直接校验，用于提交form表单时。若设置为true即mounted时监听所有输入项blur时校验
 * @param {Boolean} object.showAllError 默认遇到校验失败即停止，若设置为true则全部进行无终止校验
 * @returns {Promise} 返回Promise对象，校验无误进入then，校验有异常进入catch
 */
const formValidateAll = (oject) => {
    let {element, validator, listener, showAllError} = oject;
    if(!element || !validator){
        alert("必填参数不能为空");
        return
    }
    let doms = [];
    //使用递归的方式先序遍历DOM树
    const traversal = (node, filter = []) => {
        //对node的处理，没有name该node就不做检验
        if(node && node.nodeType === 1 && node.name && filter.indexOf(node.tagName.toLowerCase()) > -1){
            doms.push(node);
        }
        let i = 0, childNodes = node.childNodes, item;
        for(; i < childNodes.length ; i++){
            item = childNodes[i];
            if(item.nodeType === 1){
                //递归先序遍历子节点
                traversal(item, filter);
            }
        }
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            traversal(element, ['input', 'select', 'textarea', 'radio', 'checkbox']);
            console.log(doms);
            let returnValues = [];
            for(let i = 0, length = doms.length; i < length; i ++){
                let dom = doms[i];
                if(listener){
                    dom.addEventListener("blur", () => {
                        formValidate(dom, validator);
                    })
                }else {
                    let item = formValidate(dom, validator);
                    returnValues.push(item);
                    if(!item){
                        if(!showAllError) break;
                    }
                }
            }
            if(!listener){
                if(returnValues.indexOf(false) > -1){
                    reject("校验失败");
                }else{
                    resolve("校验无误");
                }
            }
        }, 100)
    })
}

/**
 * 读取文件
 * @param {Function} callback   回调函数
 * @return {Base64} 回调函数返回base64
 */
const formFileReader = (callback) => {
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = e.target.result;
        if(typeof callback === "function") callback(data);
    }
}

export {
    formTrim,
    formValidate,
    formValidateAll,
    formFileReader
}