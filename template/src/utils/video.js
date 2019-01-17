/**
 * 视频相关处理
 * @module video
 */

/**
 * @author zhongxianyu
 * @description 获取一个可存取到该file的url
 * @param {Blob} file 文件上传的Blob值
 * @returns {Object} 生成的对象URL，通过这个URL可以获取到所指定文件的完整内容
 */
const getObjectURL = (file) => {
    let url = null;
    if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
        // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

/**
 * @author zhongxianyu
 * @description 上传视频解析第一帧作为封面，video标签的src需为对象或base64，故不支持url。且此方法兼容性极差，上传成功poster设置为默认图较合适。
 * @param {HTMLElement} elment video标签
 */
const videoUploadGetPoster = (elment) => {
    let target = elment.target;
    //只有Blob或者base64可以被canvas读取
    if(target.src && target.src.indexOf("http") > -1){
        return;
    }
    let scale = 1, canvas = document.createElement("canvas"); //canvas画布
    canvas.width = target.videoWidth * scale;
    canvas.height = target.videoHeight * scale;
    canvas
        .getContext("2d")
        .drawImage(target, 0, 0, canvas.width, canvas.height); //画图
    target.poster = canvas.toDataURL("image/png"); //关键一步 —— 设置标签的 poster 属性的值为 base64 编译过后的canvas绘图。
}

export {
    getObjectURL,
    videoUploadGetPoster
}