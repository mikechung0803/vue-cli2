<template>
    <div class="form-wrap">
        <div class="form-upload box">
        <div class="form-upload">
            <div class="form-msg">
                <ul>
                    <li>
                        <div class="me-text">头像<span>*</span></div>
                        <div class="me-upload me-head" :class="{'noBg': avatorNobg}">
                            <img src="../../assets/uploader.png" ref="avatorTag">
                            <input
                                ref="avator"
                                type="file"
                                @change="(e) => previewImg(e.target, 'avator')"
                                accept="image/*"
                                class="upload-input"
                            >
                        </div>
                    </li>
                    <li>
                        <div class="me-text">全身生活照<span>*</span></div>
                        <div class="me-upload" :class="{'me-photo': !wholeImg, 'noBg': wholeImg}">
                            <img src="../../assets/uploader.png" ref="photoTag">
                            <input
                                ref="photo"
                                type="file"
                                @change="(e) => previewImg(e.target, 'photo')"
                                accept="image/*"
                                class="upload-input"
                            >
                        </div>
                    </li>
                    <li>
                        <div class="me-text">
                            参赛视频<span>*</span>
                            <span class="upload-text">上传20MB以内视频</span>
                        </div>
                        <div class="me-upload me-video" :class="{'noBg': videoNobg}">
                            <video
                                webkit-playsinline="true"
                                playsinline="true"
                                x5-playsinline="true"
                                width="100%"
                                height="100%"
                                ref="videoTag"
                                preload="auto"
                                @loadeddata="loadVideo"
                            ></video>
                            <input
                                type="file"
                                ref="video"
                                @change="previewVideo"
                                accept="video/mp4, video/x-m4v, video/*"
                                class="upload-input"
                            >
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        </div>
        <!-- 头像裁剪浮层 start -->
        <div class="Alert" v-show="imgAlert">
            <div class="content expandPhoto">
                <img :src="cropImg" alt class="cropImg" ref="cropImg">
                <div class="imgButton">
                    <div @click="imgAlert = false">取消</div>
                    <div @click="tailorImg">确认</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
export default {
    name: "pageMedia",
    data() {
        return {
            imgAlert: false,
            cropImg: "",
            avatorNobg: false,
            wholeImg: false,
            videoNobg: false
        };
    },
    created() {},
    mounted() {
        this.cropper = new Cropper(this.$refs.cropImg, {
            aspectRatio: 1 / 1,
            viewMode: 1,
            dragMode: "move",
            responsive: true,
            background: true, // 容器是否显示网格背景
            movable: true, //是否能移动图片
            cropBoxMovable: false, //是否允许拖动裁剪框
            cropBoxResizable: false, //是否允许拖动 改变裁剪框大小
            crop: function(e) {}
        });
    },
    methods: {
        loadVideo() {
            return $util.videoUploadGetPoster();
        },
        // 预览图片
        previewImg(target, type) {
            let that = this;

            if (!target.value) {
                return false;
            }
            // 获取File引用:
            let file = target.files[0];

            //判断文件类型
            if (
                file.type !== "image/jpeg" &&
                file.type !== "image/png" &&
                file.type !== "image/jpg"
            ) {
                $j.toast("不支持的文件格式");
                return false;
            }

            // 读取文件:
            let reader = new FileReader();
            reader.onload = function(e) {
                let data = e.target.result;

                if (type == "avator") {
                // 裁剪图片
                that.cropImg = data;
                that.imgAlert = true;
                if (that.cropper) that.cropper.replace(data);
                // input置空否则已上传的文件不可再次上传
                target.value = "";
                } else if(type == 'photo'){
                $util.imgCompress(data, {
                    width:1280,
                    height:1280,
                    level:0.8, //图片保存质量
                }, (fileImg) => {
                    let urlFile = $util.convertBase64ToBlob(fileImg);  //这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断；
                    if(urlFile.size/1024 > 2048){
                        $j.toast("图片过大，请重新上传图片");
                    }
                    that.$refs.photoTag.src = fileImg;
                    that.wholeImg = true;
                    target.value = "";
                });
                }
            };
            // 以DataURL的形式读取文件:
            reader.readAsDataURL(file);
            return true;
        },
        // 裁剪图片成功
        tailorImg() {
            let result = this.cropper.getCroppedCanvas();
            $util.imgCompress(result.toDataURL(), {
                width:1280,
                height:1280,
                level:0.8 //图片保存质量
            }, (fileImg) => {
                let urlFile = $util.convertBase64ToBlob(fileImg);  //这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断；
                if(urlFile.size/1024 > 2048){
                    $j.toast("图片过大，请重新上传图片");
                }
                this.$refs.avatorTag.src = fileImg;
                this.imgAlert = false;
                this.cropImg = "";
                this.avatorNobg = true;
            });
        },
        previewVideo(e) {
            let that = this, target = e.target;

            if (!target.value) {
                return false;
            }
            // 获取File引用:
            let file = target.files[0],
                size = file.size;
            if (size >= 20 * 1024 * 1024) {
                $j.toast("视频不能大于20兆");
                return false;
            }
            if (!file.type.startsWith("video")) {
                $j.toast("不支持的视频格式");
                return false;
            }
            this.$service.getvideoLink({
                videoName: file.name,
                fileSize: String(size)
            })
            .then(res => {
                if (res.code == 0) {
                let url =
                    location.protocol.indexOf("https") > -1
                    ? res.data.uploadUrlHttps
                    : res.data.uploadUrl,
                    playUrl = res.data.playUrl;
                let formData = new FormData();
                formData.append("video_file", file);
                this.$service.uploadVideo(url, formData)
                    .then(res => {
                    if (res.code == 0) {
                        $j.toast("视频上传成功");
                        target.value = "";
                        this.videoNobg = true;
                        this.$refs.videoTag.poster = require("../../assets/videoBg.jpg");
                        // video本地加载方案一，兼容性极差
                        // this.$refs.videoTag.src = playUrl;
                        // this.$refs.videoTag.src = getObjectURL(file);
                        // this.$refs.videoTag.load();

                        // video本地加载方案二，兼容性极差
                        // let reader = new FileReader();
                        // reader.onload = function(e) {
                        //   let data = e.target.result;
                        //   that.$refs.videoTag.src = data;
                        //   that.videoNobg = true;
                        // };
                        // // 以DataURL的形式读取文件:
                        // reader.readAsDataURL(file);
                    } else {
                        $j.toast("视频上传失败");
                    }
                    })
                    .catch(err => {
                    console.log(err);
                    $j.toast("视频上传失败");
                    });
                } else {
                $j.toast("视频上传失败");
                }
            })
            .catch(err => {
                console.log(err);
                $j.toast("获取上传视频链接失败");
            });
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "./index";
</style>
