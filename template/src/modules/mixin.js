/**
 * Vue混合插件
 * @module mixin
 */
import {globalWholePageView, globalWholePopupView} from 'config'

/**
 * @description 商品流，需单独引入
 * @author zhongxianyu
 * @example v-load-more="{Function}" 在methods中写入滚动到底触发函数
 */
let _binding = null;
let _el = null;
let _mixinBindEvent = () => {
	var u = navigator.userAgent;
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isSafari = (userAgent.indexOf("Safari") > -1);
	var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
	if(isiOS && window.isNative){   //iosapp内防止多次加载
		if ($util.scrollTopOfBody() + document.documentElement.clientHeight == document.documentElement.scrollHeight) {
            _binding.value();
		}
	}else{
		if (isSafari && isiOS) {    //ios sarafi 浏览器隐藏地址栏高度不一致，取屏幕高度  经测试地址栏隐藏相差69
			if ($util.scrollTopOfBody() + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 69) {
				_binding.value();
			}
		} else if (isChrome && !isiOS) {  //安卓 sarafi 浏览器隐藏地址栏高度不一致，取屏幕高度  经测试地址栏隐藏相差56
			if ($util.scrollTopOfBody() + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 56) {
				
				_binding.value();
			}
		} else {
			if ($util.scrollTopOfBody() + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
				
				_binding.value();
			}
		}
   }
}

let _listen = () => {
	document.addEventListener('touchmove', _mixinBindEvent, false);
	document.addEventListener("scroll", _mixinBindEvent, false);
}

let _clear = () => {
	document.removeEventListener('touchmove', _mixinBindEvent, false);
	document.removeEventListener("scroll", _mixinBindEvent, false);
}

export const loadMore = {
    data() {
        return {
            isHasDataShow:true, //是否还有未加载数据，到底则设置为false展示“没有更多了”
            hasData:false, //是否包含数据，商品数量为0或异常则可展示“抱歉，没有找到任何数据”
            isHandTouch:false, //兼容华为uc浏览器滑动惯性问题
            fetching:false, //防止接口重复请求
            isFirst:true //是否第一次加载，防止首次进入页面就执行loadMore
        }
    },
	beforeDestroy() {
		_clear();
	},
	mounted() {
        _listen();
        document.addEventListener('touchstart', function(){
            this.isHandTouch=true;
        }, false);
        document.addEventListener('touchend', function(){
            this.isHandTouch=false;
        }, false);

	},
	activated() {
		//keep alive先解除 再监听
		_clear();
		_listen();
	},
	directives: {
		'load-more': {
			bind: (el, binding) => {
				_binding = binding;
				_el = el;
			}
		}
	}
}

/**
 * @description 公共mixin，无需import引入
 */
const mixin = {
    created() {
        this.vueGetName().then(name => {
            console.log("vue-name：",name);
            if(name.indexOf('page') == 0) {
                JSSDK.WebView.showCloseBtn();
            }
            if(name.indexOf('miniProgram') > -1) {
                $util.$LAB.script("//res.wx.qq.com/open/js/jweixin-1.3.2.js").then(() => {
                    console.log('miniProgram ready')
                })
            }
        })
    },
    mounted() {
        this.vueGetName().then(name => {
            // 首次mounted晚于DOMContentLoaded，所以第一次在initialization执行，路由跳转后的页面再mixin的mounted里执行
            if(globalWholePageView){
                let doms = document.querySelectorAll(".whole-page-view");
                for (var i = 0, length = doms.length; i < length; i++) {
                    doms[i].style.maxWidth = window.maxPageWidth + 'px';
                    doms[i].style.height = '100vh';//clientHeight
                }
            }
            if(globalWholePopupView){
                let doms = document.querySelectorAll(".whole-popup-view");
                for (var i = 0, length = doms.length; i < length; i++) {
                    doms[i].style.maxWidth = window.maxPopupWidth + 'px';
                    doms[i].style.height = '100vh';//clientHeight
                }
            }
        })
    },
    methods: {
        /**
         * @function vueGetName
         * @author zhongxianyu
         * @description 返回vue模版的name值
         */
        vueGetName() {
            return new Promise((resolve, reject) => {
                if(this.$options.name && this.$options.name != 'keep-alive' && this.$options.name != 'App') {
                    resolve(this.$options.name);
                }
            })
        }
    }
}

export default mixin;