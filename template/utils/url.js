/**
 * url相关处理
 * @module url
 * @author zhongxianyu
 */

/**
 * @author zhongxianyu
 * @description 获取url参数
 * @param {String} name   url参数
 * @returns {String} url参数值
 */
const urlGetQuery = name => {
    var reg = new RegExp('(^|&|\\?)' + name + '=([^(&|#)]*)', 'i');
    var r = location.href.match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return "";
}

/**
 * @author zhongxianyu
 * @description 替换或追加url参数
 * @param {String} url  源链接 
 * @param {String} arg 替换或追加的key值
 * @param {String} val 替换或追加value值
 * @returns {String} 拼接好的url
 *  */
const urlChangeQuery = (url, arg, val) => {
    var pattern = arg + '=([^&]*)';
    var replaceText = arg + '=' + val;
    return url.match(pattern) ? url.replace(eval('/(' + arg + '=)([^&]*)/gi'), replaceText) : (url.match('[\?]') ? url + '&' + replaceText : url + '?' + replaceText);
}

export {
    urlGetQuery,
    urlChangeQuery
}