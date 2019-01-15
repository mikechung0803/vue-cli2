/**
 *  @global
 *  @description 路由模式history或hash，通天塔只支持hash模式，因为history模式需要path都定位到index.html
 */
const globalRouterConfig = {
    mode: 'hash',
    async: false,
    syncRegExp: /\/\/router-sync[\s\S]*\/\/router-sync/,
    asyncRegExp: /\/\/router-async[\s\S]*\/\/router-async/,
    repalceValue: '',
    bundle: false, //true表示util使用bundle.min.js，false则不实用不bundle可热更新开发，开发期间建议置为false
    bundleRegExp: /\/\/bundle[\s\S]*\/\/bundle/,
    vuexRegExp: /\/\/vuex[\s\S]*\/\/vuex/
}

/**
 * @global
 * @description 是否开启埋点
 */
const globalPingConfig = {
    control: true,
    jap: {
        autoLogPv: true, // 自动上报埋点
        anchorpvflag: true, // 单页路由框架自动上报额外开关
        anchorToUri: true // hash模式pv区分
    }
};

/**
 * @global
 * @description 分子为以375x767的iphone6计算出的50px的web弹层，分母为当前同分辨率下的1rem的px值，web弹层以body计算em值兼容不同项目的不同基准
 */
const globalRatio = 50/50;

/**
 * @global
 * @description 接口是否附加风控信息
 */
const globalRisk = false;

/**
 * @global
 * @description 页面一屏展示
 */
const globalWholePageView = true;

/**
 * @global
 * @description 弹窗一屏展示
 */
const globalWholePopupView = true;

module.exports = {
    globalRouterConfig,
    globalPingConfig,
    globalRatio,
    globalRisk,
    globalWholePageView,
    globalWholePopupView
}