/**
 * 加密处理
 * @module encrpt
 */

import jsSHA from "jssha"

/**
 * @author zhongxianyu
 * @description sha1加密
 * @param {String} str 加密前的值
 */
function encrptSHA1(str) {
    let shaObj = new jsSHA("SHA-1","TEXT", {numRounds: 1});
    shaObj.update(str);
    return shaObj.getHash("HEX");
}

export {
    encrptSHA1
}