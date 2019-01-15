<template>
  <div class="form-wrap">
    <div class="form-information box">
      <div class="form-msg">
        <ul class="form-me clearfix">
          <li v-if="items.userName!==undefined">
            <div class="me-text">姓名<span>*</span></div>
            <input name="userName" class="form-name" v-model.trim="formData.userName" type="text" placeholder="姓名" :disabled="items.userName" maxlength="15"/>
          </li>
          <li v-if="items.gender!==undefined">
            <div class="me-text">性别<span>*</span></div>
              <div class="gender">
                <select name="gender" v-model="formData.gender" :disabled="items.gender!=undefined">
                    <option style='display: none' value=""></option>
                    <option value="1">男</option>
                    <option value="0">女</option>
                </select>
              </div>
          </li>
          <li v-if="items.age!==undefined">
            <div class="me-text">年龄<span>*</span></div>
            <input name="age" pattern="[0-9]*" placeholder="年龄" @input="e => formData.age = parseInt(formData.age) || ''" v-model.trim="formData.age" :disabled="items.age" maxlength="2" />
          </li>
          <li v-if="items.school!==undefined">
            <div class="me-text">学校<span>*</span></div>
            <input name="school" placeholder="学校" v-model.trim="formData.school" :disabled="items.school" maxlength="100"/>
          </li>
          <li  v-if="items.mobile!==undefined">
            <div class="me-text">手机号<span>*</span></div>
            <input name="mobile" pattern="[0-9]*" placeholder="手机号" v-model.trim="formData.mobile"  @keyup="checkMobile" :disabled="items.mobile" maxlength="11"/>
            <i></i>
          </li>
          <li v-if="items.email!==undefined">
            <div class="me-text">邮箱<span>*</span></div>
            <input name="email" maxlength="28" placeholder="限制输入28个字符" v-model.trim="formData.email" :disabled="items.email"/>
            <i></i>
          </li>
        </ul>
        <ul class="form-like">
          <li v-if="items.intro!==undefined">
            <div class="me-text">选手简介<span>*</span></div>
            <textarea name="intro" v-model.trim="formData.intro" class="me-con" placeholder="请描述一下吧~100字以内哦" maxlength="100"></textarea>
          </li>
        </ul>
      </div>
    </div>
    <div class="form-upload box">
      <div class="form-upload">
        <div class="form-msg">
          <div class="form-submit" @click="iAgree">提交</div>
          <p class="form-title">
            <span class="checked" :class="{'checked-img': agree}" @click="agree=!agree"></span>
            <span>我同意</span>
            <span @click="openDialog" class="color-font">报名须知条款</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * @description form表单
 * @module Form
 */
export default {
    name: "pageForm",
    /**
     * data
     * @prop {Object} items 从接口获取，哪些选项展示
     * @prop {Object} formData 提交的表单数据
     * @prop {String} agree 是否同意搏命条款须知
     * @prop {String} enrollRules 报名条款须知内容，从后台配置，为html片段
     * @prop {Object} validator 校验规则，见form模块
     */
    data() {
        return {
            items: {},
            formData: {
                gender: 1
            },
            agree: true,
            enrollRules: "<h1>报名条款</h1><p>请遵守改报名条款</p>",
            validator: {
                addErrorClass: true,
                // callback: () => {},
                userName:{label: "姓名", required: true},
                gender:{label:"性别", required: true},
                age:{label:"年龄", regex: /^[1-9][0-9]$/},
                school:{label:"学校"},
                mobile:{label:"手机号", regex: /^[1].{10}$/},
                email:{label:"邮箱",regex: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/},
                intro:{label:"选手简介"},
            }
        };
    },
    created() {
        this.$service.getFormItem().then(res => {
        $j.closeLoading();
        if (res.code == 0) {
            this.items = JSON.parse(JSON.stringify(res.data.items));
            this.formData = JSON.parse(JSON.stringify(res.data.items));
        } else if (res.code == 1005) {
            if($util.getQueryString("fromStuAuth")){
                this.$router.replace({path: '/', query: {activityId: this.actId}});
                return;
                }
                let url = $util.changeUrlArg(location.href, "fromStuAuth", true);
                url = $util.changeUrlArg(res.msg, "returnUrl", encodeURIComponent(url));
                console.log(url);
                location.replace(url);
            }else if(res.code == 1012) {
                $j.toast("报名人数到达上限", "shade");
                setTimeout(() => {
                this.$router.replace({path: '/', query: {activityId: this.actId}});
                }, 2000)
            } else {
                // this.$router.replace({path: '/', query: {activityId: this.actId}});
            }
        });
    },
    mounted() {
        $util.formValidateAll({
        element: document.querySelector(".form-me"),
        validator: this.validator,
        listener: true,
        });
        this.$ping.Pin_pv('MSchoolVote_Enroll');
    },
    methods: {
        openDialog: function() {
            this.$dialog({
                title: '报名条款须知',
                content: this.enrollRules
            })
        },
        iAgree: function() {
            this.$ping.Pin_MSchoolVote_EnrollListSubmit();
            if (!this.agree) {
                $j.toast("请先同意报名须知条款");
                return;
            }
            $util.formValidateAll({
                element: document.querySelector(".form-me"),
                validator: this.validator,
            })
            .then(res => {
                console.log("=========formData",this.formData);
                this.$service.campusEnrollCommit(this.formData, this.$router)
                .then(res => {
                if(res.code == 0){
                    $j.toast("报名成功");
                    this.$router.replace({path: '/', query: {activityId: this.actId}});
                }else if(res.code == 1012){
                    $j.toast("报名人数到达上限");
                }else if(res.code == 1005){
                    let url = $util.changeUrlArg(location.href, "fromStuAuth", true);
                    url = $util.changeUrlArg(res.msg, "returnUrl", encodeURIComponent(url));
                    console.log(url);
                    location.replace(url);
                }
                })
                .catch(err => {
                console.log(err);
                $j.toast("报名信息提交失败");
                });
            }).catch(err => console.log(err))
        },
        checkMobile() {
            if(this.formData.mobile) {
                if(this.formData.mobile.length > 11){
                    this.formData.mobile = this.formData.mobile.slice(0, 11);
                }
                this.formData.mobile = parseInt(this.formData.mobile) || '';
            }
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@import "./index";
</style>