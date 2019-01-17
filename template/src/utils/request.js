import $router from '@/router';
import axios from 'axios';
import {globalRisk} from 'config';

let reqParam = {
    client: 'megatron',
    clientVersion: '1.0.0'
}
if(globalRisk) {
    $util.jdRiskControl().then(res => {
        reqParam = Object.assign(reqParam, res);
    }).catch(error => {
        console.log("获取风控值失败");
    })
}

axios.defaults.withCredentials = true;

export default function (functionId, body = {}, method = "GET") {
    let url;
    method = method.toUpperCase();
    if(ENV == 'local' || ENV == "mock"){
        method = "GET";
        url = `/static/mock/${functionId}.js`;;
    }else{
        let serverDomain = ENV === 'prod'? "api.m.jd.com":"beta-api.m.jd.com";
        url = `${location.protocol}//${serverDomain}`;
    }
    let param = Object.assign(reqParam, {
        functionId: functionId,
        body: JSON.stringify(body)
    })
    if (JSSDK.Client.isWeixin()) {
        param.loginType = 1;
        param.loginWQBiz = "active_poker";
    }
    let dataStr = ''; //数据拼接字符串
    Object.keys(param).forEach(key => {
        if(typeof param[key] == 'object') param[key] = JSON.stringify(param[key]);
        dataStr += key + '=' + param[key] + '&';
    })

    if (method == "GET") {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
        url += `?${dataStr}`;
    }
    let data = null;
    if (method == "POST") {
        data = dataStr;
    }
    $j.showLoading('',true);
    return axios({
        method: method,
        url: url,
        data: data,
        timeout: 30000
    }).then(resp => {
        $j.closeLoading();
        let data = resp.data;
        if(ENV == "mock") eval(data);
        let code = data.code;
        if (code == "99") {
            goLogin();
        } else if (code == 1 || code == 2) {
            $j.toast(["很抱歉","网络异常，稍后再试"]);
        } else if (code == 6) {
            $j.toast(["很抱歉","活动太火爆了，请稍后再来！"]);
        } else if (code == 7) {
            $j.toast(["手速惊人","休息一下，稍后再试"]);
        } else if (code == 57 || code == 55) {
            $router.replace({path:"exception",query:{msg:"活动未开始，敬请期待"}});
        } else if (code == 66) {
            $router.replace({path:"exception",query:{msg:"活动已结束，感谢参与"}});
        } else if (code == 100) {
            $j.toast(["很抱歉","网络异常，稍后再试"]);
        } else if (code == 8|| code == 1002) {
            $j.toast(["报名未开始","敬请期待"]);
        } else if (code == 1003) {
            $j.toast(["很抱歉","报名已结束，感谢参与"]);
        } else if (code == 1005) {
            $j.toast("请先进行学生认证");
        }
        return data;
    }).catch(e => {
        $j.closeLoading();
        $router.replace({path:"exception",query:{msg:"很抱歉，网络异常，稍后再试"}});
    });
}

export const upload = function (url, formData) {
    let method = 'POST';
    if(ENV == 'local' || ENV == "mock"){
        method = "GET";
        url = `/static/mock/uploadVideo.js`;
    }
    $j.showLoading('',true);
    return axios({
        method: method,
        url: url,
        data: formData
    }).then(resp => {
        $j.closeLoading();
        let data = resp.data;
        if (typeof data == 'string') data = JSON.parse(data)
        return data;
    }).catch(e => {
        $j.closeLoading();
        $j.toast("网络异常");
    });
}
