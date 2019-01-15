/**
 * jd特有功能
 * @module jdsdk
 * @author zhongxianyu
 */

/**
 * @author zhongxianyu
 * @description 是否微信环境
 * @returns {Boolean} true为微信环境
 */
const jdIsWeixin = () => {
    return JSSDK.Client.isWeixin();
}

/**
 * @author zhongxianyu
 * @description 是否京东app内
 * @returns {Boolean} true为京东app内
 */
const jdIsJDApp = () => {
    return JSSDK.Client.isJDApp();
}

/**
 * @author zhongxianyu
 * @description 是否QQ或QQ空间环境
 * @returns {Boolean} true为QQ或QQ空间环境
 */
const jdIsQQ = () => {
    return JSSDK.Client.isQQ();
}

/**
 * @author zhongxianyu
 * @description 京东登录，微信和非微信环境跳转不同
 * @param {String} url 回跳地址
 */
const jdLogin = (url = location.href) => {
    let returnurl = encodeURIComponent(url);
    if (JSSDK.Client.isWeixin()) {
        setTimeout(() => {
            location.href =
                "https://wq.jd.com/pinbind/pintokenredirect?biz=active_poker&url=" +
                returnurl;
        }, 100)
    } else {
        setTimeout(() => {
            location.href =
                "https://plogin.m.jd.com/user/login.action?appid=253&otherlogin=false&returnurl=" +
                returnurl;
        }, 100);
    }
}

/**
 * @author zhongxianyu
 * @description 跳转到绑定手机号
 * @param {String} url 回跳地址
 */
const jdBindPhone = (url = location.href) => {
    var returnurl = encodeURIComponent(url);
    setTimeout(() => {
        location.href = "https://plogin.m.jd.com/user/login.action?appid=100&kpkey=&returnurl=" +
            returnurl;
    }, 200)
}

/**
 * @author zhongxianyu
 * @description 跳转到京东首页，app内和app外不一样
 */
const jdHome = () => {
    if (jdIsJDApp()) {
        JSSDK.Native.Jump.Home.toHome();
    } else {
        location.href = "https://jd.com";
    }
}

/**
 * @author zhongxianyu
 * @description app内唤起分享面板，appp外展示引导蒙层
 * @param {Object} param 分享参数对象
 * @param {String} param.title 分享标题
 * @param {String} param.content 分享内容
 * @param {String} param.shareUrl 分享url
 * @param {String} param.iconUrl 分享图
 * @param {Function} callback 分享成功回调函数
 * @returns {Function} 回调函数，常用于埋点
 */
const jdCallSharePanel = (param, callback) => {
    let { title, content, shareUrl, channel, iconUrl } = param;
    if (jdIsJDApp()) {
        JSSDK.WebView.callSharePanel({
            title: title,
            content: content,
            shareUrl: shareUrl,
            channel: channel || "",
            iconUrl: iconUrl,
            callfunc: null
        });
    } else if (jdIsWeixin()) {
        JSSDK.WxShare.customShare({
            title: title,
            content: content,
            shareUrl: shareUrl,
            iconUrl: iconUrl
        });
    } else if (JSSDK.Client.isQQ()) {
        window.shareConfig = {
            img_url: iconUrl, //分享时所带的图片路径
            img_width: "120", //图片宽度
            img_height: "120", //图片高度
            link: shareUrl, //分享附带链接地址，只能是当前页面url
            desc: content, //分享描述
            title: title, //分享标题
            // "timelineDesc": '朋友圈描述',  //分享到朋友圈描述，仅微信生效，可不填，不填时取desc内容
            "shareCallback":function(scene, returnvalue, errrmsg){  //分享回调  可不写
                if(returnvalue=='ok'){    //注：18年8月份开始，微信api取消分享结果，因此不能通过returnvalue来判断分享成功还是取消了
                    console.log('分享成功')
                }
             }
        };
    }
    if(typeof callback === "function") callback();
}

/**
 * @author zhongxianyu
 * @description 设置右上角分享
 * @param {Object} param 分享参数对象
 * @param {String} param.title 分享标题
 * @param {String} param.content 分享内容
 * @param {String} param.shareUrl 分享url
 * @param {String} param.iconUrl 分享图
 * @param {Function} callback 回调函数
 * @returns {Function} 回调函数，常用于埋点
 */
 const jdSetShareInfo = (param, callback) => {
    let { title, content, shareUrl, iconUrl, channel } = param;
    if (jdIsJDApp()) {
        JSSDK.WebView.callHeaderSharePanel({
            title: title,
            content: content,
            shareUrl: shareUrl,
            channel: channel || "",
            iconUrl: iconUrl,
            callfunc: null
        });
    } else if (jdIsWeixin()) {
        JSSDK.WxShare.customShare({
            title: title,
            content: content,
            shareUrl: shareUrl,
            iconUrl: iconUrl
        });
    } else if (jdIsQQ()) {
        window.shareConfig = {
            img_url: iconUrl, //分享时所带的图片路径
            img_width: "120", //图片宽度
            img_height: "120", //图片高度
            link: shareUrl, //分享附带链接地址，只能是当前页面url
            desc: content, //分享描述
            title: title, //分享标题
            // "timelineDesc": '朋友圈描述',  //分享到朋友圈描述，仅微信生效，可不填，不填时取desc内容
            "shareCallback":function(scene, returnvalue, errrmsg){  //分享回调  可不写
                if(returnvalue=='ok'){    //注：18年8月份开始，微信api取消分享结果，因此不能通过returnvalue来判断分享成功还是取消了
                    console.log('分享成功')
                }
             }
        };
    }
    if(typeof callback === "function") callback();
}

/**
 * @author zhongxianyu
 * @description 强制唤起或点击唤起京东app，需提前引入//st.360buyimg.com/m/js/2014/module/plugIn/downloadAppPlugIn_imk2.js
 * 用法参考此文档：https://cf.jd.com/pages/viewpage.action?pageId=108964732
 * @param {String} url 唤起京东app展示的页面url
 * @param {String} downUrl 若设置则展示下载京东app页面，不设置停留在原页面，如https://h5.m.jd.com/active/download/download.html?channel=jd-msy1
 * @param {String} domId 需要绑定点击事件的dom的id值
 */
const jdOpenApp = (url = location.href, downUrl, domId) => {
    let config;
    if(domId) {
        config = {
            openAppBtnId:"",
            closeCallblack: function () { },
            inteneUrl: "openapp.jdmobile://virtual",
            inteneUrlParams: { "category": "jump", "des": "m", "sourceValue": "sale-act", "sourceType": "Sale", "url": url },
            M_sourceFrom: 'h5',
            noRecord: true
        }
        if(downUrl) {
            config = Object.assign(config, {
                downAppURl:downUrl,
                downAppIos:downUrl,
                downWeixin:downUrl,
                downIpad:downUrl
            })
        }
        $.downloadAppPlugIn(config);
    } else {
        // ad_od 强制唤起
        if(url.indexOf('ad_od') === -1) {
            url += url.indexOf('?') === -1 ?  '?ad_od=1' : '&ad_od=1';
            location.href = url;
        }
        config = {
            inteneUrl: "openApp.jdMobile://virtual?",
            inteneUrlParams: {
                "action": "to",
                "category": "jump",
                "des": "getCoupon",
                "url": url
            },
            NoJumpDownLoadPage: true,
            M_sourceFrom: 'h5'
        }
        if(downUrl) {
            config = Object.assign(config, {
                downAppURl:downUrl,
                downAppIos:downUrl,
                downWeixin:downUrl,
                downIpad:downUrl,
                NoJumpDownLoadPage: false
            })
        }
        $.downloadAppPlugInOpenApp(config);
    }
}

/**
 * @author zhongxianyu
 * @description 强制唤起或点击唤起京东app，如未引入script则异步加载script后再执行jdOpenApp
 * 用法参考此文档：https://cf.jd.com/pages/viewpage.action?pageId=108964732
 * @param {String} url 唤起京东app展示的页面url
 * @param {String} downUrl 若设置则展示下载京东app页面，不设置停留在原页面，如https://h5.m.jd.com/active/download/download.html?channel=jd-msy1
 * @param {String} domId 需要绑定点击事件的dom的id值
 */
const jdDownloadAppPlugInOpenApp = (url = location.href, downUrl, domId) => {
    // downUrl = "https://h5.m.jd.com/active/download/download.html?channel=jd-msy1";
    $util.$LAB.script("//st.360buyimg.com/m/js/2014/module/plugIn/downloadAppPlugIn_imk2.js")
    .then(res => {
        jdOpenApp(url, downUrl, domId)
    }).catch(error => {
        console.log("动态下载失败：jdDownloadAppPlugInOpenApp")
    })
}

/**
 * @author zhongxianyu
 * @description 请求接口是否携带风控值
 */
const jdRiskControl = () => {
    return new Promise((resolve, reject) => {
        let reqParam = {
            networkType: navigator.connection ? navigator.connection.effectiveType : "",
            eid: "",
            fp: "",
        }
        //jdapp内部回调函数  参数为手机相关信息  网络请求的时候用
        const getPhoneBasicInfoCallBack = (obj) => {
            if (typeof obj == "string") {
                obj = JSON.parse(obj);
            }
            if (obj.status == "0") {
                var data = obj.data;
                reqParam = Object.assign(reqParam, {
                    // 终端唯一设备号，联系：pengjing11
                    uuid: data.uuid,
                    // 终端系统版本，联系：pengjing11
                    osVersion: data.systemVersion,
                    // 终端设备品牌，联系：pengjing11
                    d_brand: data.brand,
                    // 终端设备机型，联系：pengjing11
                    d_model: data.model,
                    // 终端设备上网方式，联系：pengjing11
                    networkType: data.networkType,
                })
            }
        }

        //获取指纹信息
        const getFingerInfoCallBack = (cuid) => {
            reqParam.eid = cuid;
        }

    //1、获取客户端信息
        //2、获取eid fp
        if (jdIsJDApp()) {
            if (window.JDAppUnite) {
                //android
                window.JDAppUnite.getPhoneBasicInfo(getPhoneBasicInfoCallBack);
                window.JDAppUnite.getFingerInfo(getFingerInfoCallBack);
            } else if (window.webkit) {
                //ios
                window.webkit.messageHandlers.JDAppUnite.postMessage({
                    'method': 'getPhoneBasicInfo',
                    'params': getPhoneBasicInfoCallBack
                });
                window.webkit.messageHandlers.JDAppUnite.postMessage({
                    'method': 'getFingerInfo',
                    'params': getFingerInfoCallBack
                });
            }
            reqParam.fp = "-1";
            resolve(reqParam);
        } else {
            // 公共入参:shshshfp/shshshfpa/shshshfpb
            $util.$LAB.script("//h5.360buyimg.com/ws_js/jdwebm.js?v=STP1", "//gia.jd.com/m.html", "//gias.jd.com/js/m.js").then(() => {
                //必须延时否则拿不到
                setTimeout(function() {
                    var risk_jd;
                    try {
                        risk_jd = getJdEid();
                        reqParam.eid = risk_jd.eid;
                        reqParam.fp = risk_jd.fp;
                        resolve(reqParam);
                    } catch (e) {
                        reject();
                    }
                }, 1500);
            })
        }
    })
}

export {
    jdIsWeixin,
    jdIsJDApp,
    jdIsQQ,
    jdLogin,
    jdBindPhone,
    jdHome,
    jdCallSharePanel,
    jdSetShareInfo,
    jdOpenApp,
    jdDownloadAppPlugInOpenApp,
    jdRiskControl
}