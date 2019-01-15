/**
 * 公共方法
 * @module common
 * @author zhongxianyu
 */

/**
 * @description 加载静态资源
 * @author zhongxianyu
 * @param {String|Array} scripts 需要加载的静态资源
 * @returns {Promise} 所有加载成功进入then，否则进入catch
 */
const script = (scripts)=> {
    if(typeof scripts != 'string' && !Array.isArray(scripts)){
        console.log("scriptLoad只支持string或数组类型");
        return
    }
    if(typeof scripts == 'string') {
        scripts = [scripts];
    }
    let head = document.getElementsByTagName('head')[0],
        scriptDoms = document.querySelectorAll("script");

    return new Promise((resolve, reject) => {
        for(let i = 0; i < scripts.length; i++) {
            let _item = scripts[i], 
                script = false;
            for(let j = 0, length = scriptDoms.length; j < length; j++) {
                if(scriptDoms[j].src.indexOf(scripts[i].split("//")[1]) > -1) {
                    script = true;
                }
            }
            if(!script) {
                let _script = document.createElement('script');
                _script.type = 'text/javascript';
                _script.charset = 'utf-8';
                _script.src = _item;

                _script.onload = _script.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        console.log("scriptLoad success")
                        if(i == scripts.length-1) resolve()
                        _script.onload = _script.onreadystatechange = null;
                    }
                };

                _script.onerror = function (err) {
                    console.log("scriptLoad err", err)
                    reject();
                }
        
                head.appendChild(_script);
            } else {
                if(i == scripts.length-1) resolve()
            }
        }
    })
}

/**
 * 通过id删除script标签
 * @param {String} scriptId 
 */
const scriptRemove = scriptId => {
	const script = document.getElementById(scriptId);
	if (script) {
		document.body.removeChild(script);
	}
}

/**
 * 时间戳转换为时间字符
 * @author zhongxianyu
 * @param timestamp
 * @param format  例子：yyyy-MM-dd h:m:s
 * @returns {String}
 */
export const dateFormat = (timestamp, format) => {
    let newDate = new Date();
    newDate.setTime(timestamp);
    Date.prototype.formats = format => {
        let date = {
            "M+": newDate.getMonth() + 1,
            "d+": newDate.getDate(),
            "h+": newDate.getHours(),
            "m+": newDate.getMinutes(),
            "s+": newDate.getSeconds(),
            "q+": Math.floor((newDate.getMonth() + 3) / 3),
            "S+": newDate.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '')
                .substr(4 - RegExp.$1.length));
        }
        for (let k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? date[k] : ("00" + date[k])
                        .substr(("" + date[k]).length));
            }
        }
        return format;
    }
    return newDate.formats(format);
}

/**
 * 深拷贝
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 * @param {*} obj 拷贝对象
 * @param {Array<Object>} cache
 * @return {*}
 */
const deepCopy = (obj, cache = []) => {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }
  
    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }
  
    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })
  
    Object.keys(obj).forEach(key => {
        copy[key] = deepCopy(obj[key], cache)
    })
  
    return copy
}

/**
 * 防抖函数
 * 定义：多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行。
 * 原理：对处理函数进行延时操作，若设定的延时到来之前，再次触发事件，则清除上一次的延时操作定时器，重新定时。
 * @author zhongxianyu
 * @param action 事件触发的操作
 * @param delay 多少毫秒内连续触发事件，不会执行
 * @returns {Function}
 */
function debounce(action,delay) {
    let timeout = null
    return function () {
        let context = this,
            args = arguments,
            runCallback = function () {
                action.apply(context, args)
            }
        timeout && clearTimeout(timeout)
        timeout = setTimeout(runCallback, delay)
    }
}

/**
 * 节流函数
 * 定义：触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用。
 * 原理：对处理函数进行延时操作，若设定的延时到来之前，再次触发事件，则清除上一次的延时操作定时器，重新定时。
 * @author zhongxianyu
 * @param action 事件触发的操作
 * @param delay 间隔多少毫秒需要触发一次事件
 */
const throttle = (action, delay) => {
    let timeout = null
    let lastRun = 0
    return function () {
        if (timeout) {
            return
        }
        let elapsed = Date.now() - lastRun
        let context = this
        let args = arguments
        let runCallback = function () {
            lastRun = Date.now()
            timeout = false
            action.apply(context, args)
        }
        if (elapsed >= delay) {
            runCallback()
        } else {
            timeout = setTimeout(runCallback, delay)
        }
    }
}

export default {
    script,
    scriptRemove,
    dateFormat,
    deepCopy,
    debounce,
    throttle
}