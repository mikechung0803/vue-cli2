/**
 * @alias jdPing
 * @author zhongxianyu
 * @description M端埋点接入流程，可以根据情况在函数里设置默认值，参考文档：https://cf.jd.com/pages/viewpage.action?pageId=79700612
 * @param {Object} o    埋点参数
 * @param {String|Number} o.eventId    必选参数，事件id
 * @param {String} o.event_param  设置click的参数
 * @param {String|Number} o.page_id  page_id，当前页面id
 * @param {Number} o.level  event_level，设置事件等级
 * @param {String} o.page_name  当前页面类名或（M页）去参URL
 * @param {String} o.page_param 当前页面参数
 **/
const Ping = o => {
    setTimeout(() => {
        try {
            let eventId = o.eventId;
            let click = new MPing.inputs.Click(eventId);
            if (o.param) {
                click.event_param = o.event_param;
            } else {
                click.event_param = '';
            }
            if (o.pageid) {
                click.page_id = o.page_id;
            } else {
                click.page_id = "MSchoolVote_Home";
            }
            o.level && (click.event_level = o.level);
            o.page_name && (click.page_name = o.page_name);
            click.updateEventSeries();
            let mping = new MPing();
            mping.send(click);
        } catch (e) { }
    }, 1);
};

//////////
// 埋点配置 //
//////////
export default {
    Pin_pv: (id) => {
        setTimeout(() => {
            try {
                // 构造pv 请求,可选参数为pageId，可以为数字、字符串、或者{pageId: "1212"}；如埋点方案未要求或者未提到pageid，请忽略，即 var pv = new MPing.inputs.PV();
                var pv = new MPing.inputs.PV(id);
                var mping = new MPing();         // 构造上报实例
                mping.send(pv);
            } catch (e) {
                console.log("e", e);
            }
        }, 300)
    },
 /*1 活动首页-点击-报名按钮 校园报名投票大赛*/ Pin_MSchoolVote_HomeEnroll: () => { Ping({ eventId: "MSchoolVote_HomeEnroll" }); },
 /*2 活动首页-点击-个人主页按钮 校园报名投票大赛*/  Pin_MSchoolVote_HomePersonal: () => { Ping({ eventId: "MSchoolVote_HomePersonal"}); },
 /*3 活动首页-点击-搜索栏 校园报名投票大赛*/  Pin_MSchoolVote_HomeSearchBox: () => { Ping({ eventId: "MSchoolVote_HomeSearchBox"}); },
 /*4 活动首页-点击-投票按钮 校园报名投票大赛*/  Pin_MSchoolVote_HomeVote: () => { Ping({ eventId: "MSchoolVote_HomeVote" }); },
 /*5 活动首页-点击-选手信息 校园报名投票大赛*/  Pin_MSchoolVote_HomeInfo: () => { Ping({ eventId: "MSchoolVote_HomeInfo"}); },
 /*6 活动首页-点击-查看更多 校园报名投票大赛*/ Pin_MSchoolVote_HomeCheckMore: () => { Ping({ eventId: "MSchoolVote_HomeCheckMore" }); },
 /*7 活动首页-点击-活动规则 校园报名投票大赛*/  Pin_MSchoolVote_HomeRule: () => { Ping({ eventId: "MSchoolVote_HomeRule"}); },
 /*8 活动首页-底部弹层-点赞按钮 校园报名投票大赛*/  Pin_MSchoolVote_HomeToastVote: () => { Ping({ eventId: "MSchoolVote_HomeToastVote"}); },
 /*9 活动首页-底部弹层-学生认证按钮 校园报名投票大赛*/  Pin_MSchoolVote_HomeToastIdentify: () => { Ping({ eventId: "MSchoolVote_HomeToastIdentify"}); },
 /*10 报名页-点击-提交 校园报名投票大赛*/  Pin_MSchoolVote_EnrollListSubmit: () => { Ping({ eventId: "MSchoolVote_EnrollListSubmit" , page_id: "MSchoolVote_Enroll" }); },
 /*11 搜索结果页-点击-邀请小伙伴报名 校园报名投票大赛*/ Pin_MSchoolVote_SearchListInvite: () => { Ping({ eventId: "MSchoolVote_SearchListInvite", page_id: "MSchoolVote_SearchList" }); },
 /*12 搜索结果页-点击-投票 校园报名投票大赛*/  Pin_MSchoolVote_SearchListVote: () => { Ping({ eventId: "MSchoolVote_SearchListVote", page_id: "MSchoolVote_SearchList"}); },
 /*13 搜索结果页-点击-选手信息 校园报名投票大赛*/  Pin_MSchoolVote_SearchListInfo: () => { Ping({ eventId: "MSchoolVote_SearchListInfo", page_id: "MSchoolVote_SearchList"}); },
 /*14 个人主页-点击-投票 校园报名投票大赛*/  Pin_MSchoolVote_PersonalVote: () => { Ping({ eventId: "MSchoolVote_PersonalVote", page_id: "MSchoolVote_Personal" }); },
 /*15 个人主页-点击-播放视频按钮 校园报名投票大赛*/  Pin_MSchoolVote_PersonalPlay: () => { Ping({ eventId: "MSchoolVote_PersonalPlay", page_id: "MSchoolVote_Personal" }); },
 /*16 报名活动首页-点击-邀请小伙伴报名 校园报名投票大赛*/ Pin_MSchoolVote_HomeInvite: () => { Ping({ eventId: "MSchoolVote_HomeInvite" }); },
};