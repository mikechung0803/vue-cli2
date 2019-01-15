/**
 * jelly web弹窗组件
 * @module jelly
 * @author zhongxianyu
 */
;
! function (win) {

  "use strict";

  var doc = document,
    query = 'querySelectorAll',
    claname = 'getElementsByClassName',
    S = function (s) {
      return doc[query](s);
    };

  //默认配置
  var config = {
    type: 0,
    shade: true,
    shadeClose: true,
    fixed: true,
    anim: 'scale' //默认动画类型
  };

  var ready = {
    extend: function (obj) {
      var newobj = JSON.parse(JSON.stringify(config));
      for (var i in obj) {
        newobj[i] = obj[i];
      }
      return newobj;
    },
    timer: {},
    end: {}
  };

  //点触事件
  ready.touch = function (elem, fn) {
    elem.addEventListener('click', function (e) {
      fn.call(this, e);
    }, false);
  };

  var index = 0,
    classs = ['layui-m-layer'],
    Jelly = function (options) {
      var that = this;
      that.config = ready.extend(options);
      that.view();
    };

  Jelly.prototype.view = function () {
    var that = this,
      config = that.config,
      layerbox = doc.createElement('div');

    that.id = layerbox.id = classs[0] + index;
    layerbox.setAttribute('class', classs[0] + ' ' + classs[0] + (config.type || 0));
    layerbox.setAttribute('index', index);

    //标题区域
    var title = (function () {
      var titype = typeof config.title === 'object';
      return config.title ?
        '<h3 class="jelly-title" style="' + (titype ? config.title[1] : '') + '">' + (titype ? config.title[0] : config.title) + '</h3>' :
        '';
    }());

    //按钮区域
    var button = (function () {
      typeof config.btn === 'string' && (config.btn = [config.btn]);
      var btns = (config.btn || []).length,
        btndom;
      if (btns === 0 || !config.btn) {
        return '';
      }
      btndom = '<span yes type="1">' + config.btn[0] + '</span>'
      if (btns === 2) {
        btndom = '<span no type="0">' + config.btn[1] + '</span>' + btndom;
      }
      return '<div class="layui-m-layerbtn">' + btndom + '</div>';
    }());

    if (!config.fixed) {
      config.top = config.hasOwnProperty('top') ? config.top : 100;
      config.style = config.style || '';
      config.style += ' top:' + (doc.body.scrollTop + config.top) + 'px';
    }
    if (config.type === 2) {
      // config.content = '<i></i><i class="layui-m-layerload"></i><i></i><p>'+ (config.content||'') +'</p>';
      config.content = '<div class="jdui_load"><span class="jdui_load_in"></span></div><p>'+ (config.content||'') +'</p>';
    }
    if (config.skin) config.anim = 'up';
    if (config.skin === 'msg') config.shade = false;
    if (config.toastType === 'shade') {
      config.shade = true;
      config.shadeClose = false;
    }
    if (config.skin === 'msg') {
      var _html = '', content = config.content;
      if (typeof content == 'object') {
        for (var i = 0, length = content.length; i < length; i++) {
          _html += '<p>' + content[i] + '</p>';
        }
      } else {
        _html = '<p>' + content + '</p>';
      }
      config.content = '<div class="jelly-toast">' + ( config.toastType? '<div class="jelly-icon icon_' + config.toastType + '"></div>': '') + _html + '</div>'
    }
    layerbox.innerHTML = (config.shade ? '<div ' + (typeof config.shade === 'string' ? 'style="' + config.shade + '"' : '') + ' class="layui-m-layershade"></div>' : '') +
      '<div class="layui-m-layermain" ' + (!config.fixed ? 'style="position:static;"' : '') + '>' +
      '<div class="layui-m-layersection">' +
      '<div class="layui-m-layerchild ' + (config.skin ? 'layui-m-layer-' + config.skin + ' ' : '') + (config.className ? config.className : '') + ' ' + (config.anim ? 'layui-m-anim-' + config.anim : '') + '" ' + (config.style ? 'style="' + config.style + '"' : '') + '>' +
      title +
      (config.skin === 'msg'? config.content: '<div class="layui-m-layercont">' + config.content + '</div>') +
      button +
      '</div>' +
      '</div>' +
      '</div>';

    if (!config.type || config.type === 2) {
      var dialogs = doc[claname](classs[0] + config.type),
        dialen = dialogs.length;
      if (dialen >= 1) {
        jelly.close(dialogs[0].getAttribute('index'))
      }
    }

    document.body.appendChild(layerbox);
    var elem = that.elem = S('#' + that.id)[0];
    config.success && config.success(elem);

    that.index = index++;
    that.action(config, elem);
  };

  Jelly.prototype.action = function (config, elem) {
    var that = this;

    //自动关闭
    if (config.time) {
      ready.timer[that.index] = setTimeout(function () {
        jelly.close(that.index);
        typeof config.cb === 'function' && config.cb();
      }, config.time * 1000);
    }

    //确认取消
    var btn = function () {
      var type = this.getAttribute('type');
      if (type == 0) {
        config.no && config.no();
        jelly.close(that.index);
      } else {
        config.yes ? config.yes(that.index) : jelly.close(that.index);
      }
    };
    if (config.btn) {
      var btns = elem[claname]('layui-m-layerbtn')[0].children,
        btnlen = btns.length;
      for (var ii = 0; ii < btnlen; ii++) {
        ready.touch(btns[ii], btn);
      }
    }

    //点遮罩关闭
    if (config.shade && config.shadeClose) {
      var shade = elem[claname]('layui-m-layershade')[0];
      ready.touch(shade, function () {
        config.no && config.no();
        jelly.close(that.index, config.end);
      });
    }

    config.end && (ready.end[that.index] = config.end);
  };

  win.jelly = {
    v: '1.0',
    index: index,

    //核心方法
    open: function (options) {
      var o = new Jelly(options || {});
      return o.index;
    },

    close: function (index) {
      var ibox = S('#' + classs[0] + index)[0];
      if (!ibox) return;
      ibox.innerHTML = '';
      doc.body.removeChild(ibox);
      clearTimeout(ready.timer[index]);
      delete ready.timer[index];
      typeof ready.end[index] === 'function' && ready.end[index]();
      delete ready.end[index];
    },
    /**
     * @function jellyCloseAll
     * @author zhongxianyu
     * @description 关闭所有的jelly弹层
     */
    closeAll: function () {
      var boxs = doc[claname](classs[0]);
      for (var i = 0, len = boxs.length; i < len; i++) {
        jelly.close((boxs[0].getAttribute('index') | 0));
      }
    },
    /**
     * @function jellyToast
     * @author zhongxianyu
     * @description $j.toast(text, type, time, cb)
     * @param {String} text 文案
     * @param {String} type 类型，shade为遮罩层，还有……
     * @param {Number} time 关闭toast时间（秒），默认2秒
     * @param {Function} cb toast关闭时的回调函数
     */
    toast: function (text, type, time, cb) {
      jelly.open({
        content: text,
        toastType: type || 'shade',
        skin: 'msg',
        time: time ? time : 2, //2秒后自动关闭
        cb: cb
      });
    },
    /**
     * @function jellyConfirm
     * @author zhongxianyu
     * @description 确认框
     * @param {Object} options 参数对象
     * @param {String} options.title 标题
     * @param {String} options.content 内容
     * @param {Array} options.btn 数组，两个按钮文案
     * @param {Function} options.yes 红色按钮回调函数
     * @param {Function} options.no 白色按钮回调函数
     * @param {Boolean} options.shade 是否开启遮罩层
     * @param {Boolean} options.shadeClose 点击遮罩层是否可以关闭
     */
    confirm: function (options) {
      jelly.open({
        title: options.title,
        content: options.content,
        btn: options.btn,
        yes: function (index) {
          if (typeof (options.yes) != "undefined") {
            options.yes();
          }
          jelly.close(index);
        },
        no: function (index) {
          if (typeof (options.no) != "undefined") {
            options.no();
          }
        },
        shade: options.shade,
        shadeClose: options.shadeClose,
      });
    },
    /**
     * @function jellyShowLoading
     * @author zhongxianyu
     * @description 出现loading
     * @param {*} text 选填，loading图标下的文案
     * @param {*} isShade 是否出现遮罩层
     */
    showLoading: function (text, isShade) {
      jelly.open({
        type: 2,
        content: text,
        shade: isShade?isShade:false
      });
    },
    /**
     * @function jellyCloseLoading
     * @author zhongxianyu
     * @description 关闭loading
     */
    closeLoading: function () {
      jelly.closeAll();
    },
    /**
     * @function JellyInfoAlert
     * @author zhongxianyu
     * @description alert弹层
     * @param {String} text 内容
     * @param {Array} btn 按钮文案
     * @param {String} title 标题
     */
    infoAlert: function (text, btn, title) {
      jelly.open({
        title: [title ? title : ''],
        content: text ? text : '具体名词解释以产品提供的文案为准，具体名词解释一产品最多20个字',
        btn: btn ? btn : '确定'
      });
    },
  };


  (function (window, undefined) {
    var
      // Map over jelly in case of overwrite
      _jelly = window.jelly,
      // Map over the $j in case of overwrite
      _$j = window.$j;
    jelly.noConflict = function (deep) {
      if (window.$j === jelly) {
        window.$j = _$j;
      }
      if (deep && window.jelly === jelly) {
        window.jelly = _jelly;
      }
      return jelly;
    }

    window.$j = jelly.noConflict();
  }(window));
}(window);
