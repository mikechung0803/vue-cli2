/**
 * 图片处理
 * @module image
 */

import EXIF from "exif-js";

/**
 * @author zhongxianyu
 * @description 图片压缩
 * @param {String} base64 图片base64
 * @param {*} maxSize 压缩尺寸，质量，旋转角度
 * @param {*} callback 回调函数
 */
const imgCompress = (base64, maxSize = {}, callback) => {
    let _orientation, blob = convertBase64ToBlob(base64);
    // 获取照片旋转方向
    EXIF.getData(blob,function(){
        _orientation=blob.exifdata&&blob.exifdata.Orientation;
    });

    maxSize = Object.assign({
        width:1280,
        height:1280,
        level:0.8,      //图片保存质量
        _orientation: _orientation //图片旋转角度
    }, maxSize);
    let Img = new Image();
    Img.src = base64;
    Img.onload = function(){
        let w = this.naturalWidth,
            h = this.naturalHeight,
            resizeW = 0,
            resizeH = 0;
        //计算压缩比例
        if(w > maxSize.width || h > maxSize.height){
            let multiple = Math.max(w / maxSize.width , h / maxSize.height);
            resizeW = w / multiple;
            resizeH = h / multiple; 
        }else{
            resizeW = w;
            resizeH = h;
        }
        let canvas = document.createElement("canvas"),
            ctx = canvas.getContext('2d');
            //铺底色
            ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ios bug，iphone手机上可能会遇到图片方向错误问题
        switch(maxSize._orientation){
        //iphone横屏拍摄，此时home键在左侧
        case 3:
            canvas.width = resizeW;
            canvas.height = resizeH;
            ctx.rotate(180 * Math.PI / 180);
            ctx.drawImage(Img,-resizeW,-resizeH,resizeW,resizeH);
            break;
        //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
            canvas.width = resizeH;
            canvas.height = resizeW;
            ctx.rotate(90 * Math.PI / 180);
            ctx.drawImage(Img,0,-resizeH,resizeW,resizeH);
            break;
        //iphone竖屏拍摄，此时home键在上方
        case 8:
            canvas.width = resizeH;
            canvas.height = resizeW;
            ctx.rotate(270 * Math.PI / 180);
            ctx.drawImage(Img,-resizeW,0,resizeW,resizeH);
            break;
        default:
            canvas.width = resizeW;
            canvas.height = resizeH;
            ctx.drawImage(Img,0,0,resizeW,resizeH);
        }
        let type = /data:(.*);/.exec(base64)[1];
        if(type.indexOf("/")==-1){
          $j.toast("上传图片异常");
          return;
        }
        let fileImg = canvas.toDataURL(type, maxSize.level); //base64的值
        callback && callback(fileImg);
    }
}

/**
 * @author zhongxianyu
 * @description 将base64码转化为file（Blob, 此处函数对压缩后的base64经过处理返回{size: "", type: ""} 
 * @description base64转Blob对象缺失文件名需要自己添加，form.append("file", blob, Date.now() + '.'+type.split('/')[1])
 * @param {String} base64 图片base64
 * @returns {Blob}
 */
const convertBase64ToBlob = (base64) => {
    let arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export {
    imgCompress,
    convertBase64ToBlob
}