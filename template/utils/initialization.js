import {globalPingConfig,globalRatio,globalWholePageView,globalWholePopupView} from 'config'

(function(doc, win) {
    var docEl = doc.documentElement,
        body = doc.body,
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = document.documentElement.clientWidth,
            clientHeight = document.documentElement.clientHeight;
            if (!clientWidth) return;
            if (!clientHeight) return;
            if(globalWholePageView) {
                // 移动端原型设计最佳分辨率为375x667，375/667=0.5625
                if (clientWidth / clientHeight <= 0.5625) {
                    docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
                } else {
                    win.maxPageWidth = clientHeight * 0.5625;
                    docEl.style.fontSize = 100 * (win.maxPageWidth / 750) + 'px';
                }
                // 首次mounted晚于DOMContentLoaded，所以第一次在这里执行，路由跳转后的页面再mixin的mounted里执行
                let doms = document.querySelectorAll(".whole-page-view");
                for (var i = 0, length = doms.length; i < length; i++) {
                    doms[i].style.maxWidth = win.maxPageWidth + 'px';
                    doms[i].style.height = '100vh';//clientHeight
                }
            } else {
                docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
            if(globalWholePopupView) {
                // 移动端原型设计最佳分辨率为375x667，375/667=0.5625
                if (clientWidth / clientHeight <= 0.5625) {
                    body.style.fontSize = globalRatio * 100 * (clientWidth / 750) + 'px';
                } else {
                    win.maxPopupWidth = clientHeight * 0.5625;
                    body.style.fontSize = globalRatio * 100 * (win.maxPopupWidth / 750) + 'px';
                }
                // 首次mounted晚于DOMContentLoaded，所以第一次在initialization执行，路由跳转后的页面再mixin的mounted里执行
                let doms = document.querySelectorAll(".whole-popup-view");
                for (var i = 0, length = doms.length; i < length; i++) {
                    doms[i].style.maxWidth = win.maxPopupWidth + 'px';
                    doms[i].style.height = '100vh';//clientHeight
                }
            } else {
                body.style.fontSize = globalRatio * 100 * (clientWidth / 750) + 'px';
            }
        };
    win.addEventListener(resizeEvt, recalc, false);
    win.addEventListener('DOMContentLoaded', recalc, false);
    // setTimeout(recalc, 1000);
    if(globalPingConfig && globalPingConfig.control) {
        win.jap = globalPingConfig.jap || {};
        $util.$LAB.script("//wl.jd.com/unify.min.js").then(() => {
            console.log(jap)
        }).catch(err => {
            console.log("动态下载失败：unify")
        })
    }
})(document, window);