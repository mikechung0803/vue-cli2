/**
 * 正则模块
 * @author zhongxianyu
 * @module regExp
 */

/**
 * 是否emoji表情
 * @param {String} str
 * @returns {boolean}
 */
const isEmoji = str => {
    if (str) {
        var reg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
/**
 *是否正常字符 汉字 数字 字符 _ ()组成 
 * 添加空格判断（包含空格算合法字符）
 * @param {String} str
 * @returns {boolean}
 */
const isNormal = str => {
    if (str) {
        var reg = /^[\u4E00-\u9FA5A-Za-z0-9_\s*\(\)]+$/;
        if (reg.test(str)) {
            return true;
        }
    }
    return false;
}
/**
 * 字符串是否为空 空字符视为空
 * @param {String} str 输入值
 * @returns {boolean}
 * @example
 * isEmpty() true
 * isEmpty(" ") true
 * isEmpty("") true
 * isEmpty(" 123 ") false
 */
const isEmpty = str => {
    if (str && /\S+/.test(str)) {
        return false;
    }
    return true;
}

/**
 * trim去前后空格
 * @param {String} str 输入值
 * @returns {String} 输出值
 */
const trim = str =>{
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

/**
 * 是否微信
 * @returns {Boolean}
 */
const isWeiXin = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

/**
 * 是否App
 * @returns {Boolean}
 */
const isApp = () => {
    let ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf("junion") != -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * 验证手机号
 * @returns {boolean}
 */
const isMobile = mobile => {
    let reg = /^1\d{10}$/;
    return reg.test(mobile);
}

/**
 * 获取app信息
 * @returns {Object} {os:android,version:1.0.0,isNative:true}
 */
const getAppInfo = () => {
    if (isApp()) {
        //junion-app-ios-1.0.0
        let ua = window.navigator.userAgent.toLowerCase();
        let reg = /junion-app-(\S+)-(\d+.\d+.\d+)/;
        let match = ua.match(reg);
        let isNative=false;
        if(ua.indexOf("reactnative")>-1){
        	isNative=true;
        }
        if (match && match.length == 3) {
            return {
                os: match[1],
                version: match[2],
                isNative:isNative
            };
        }
    }
    return null;
}

export {
    isEmoji,
    isNormal,
    isEmpty,
    trim,
    isWeiXin,
    isApp,
    isMobile,
    getAppInfo
}