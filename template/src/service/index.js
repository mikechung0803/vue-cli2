import request from '../utils/request'
import { upload } from '../utils/request'

//查询报名项目表单项
const getFormItem = () => {
    return request("campusEnrollGetForm").then(resp => {
        if(resp.code == 0 && resp.data && resp.data.items) {
            let items = resp.data.items;
            for(let item in items) {
                if(item == 'name' && items[item] && items[item].length > 24) items[item] = items[item].substring(0, 23) + "...";
                if(item == 'school' && items[item] && items[item].length > 24) items[item] = items[item].substring(0, 23) + "..."; 
                if(item == 'gender' && !items[item] === null) items[item] = '';
            }
        }
        return resp;
    });
}

//报名信息上传
const campusEnrollCommit = (body) => {
    return request('campusEnrollCommit', body, "POST");
}

//获取视频上传链接
const getvideoLink = (body = {}) => {
    return request("campusVideo", body);
}
//上传视频
const uploadVideo = (url, formData) => {
    return upload(url, formData);
}

const _products = [
    {"id": 1, "title": "iPad 4 Mini", "price": 500.01, "inventory": 2},
    {"id": 2, "title": "H&M T-Shirt White", "price": 10.99, "inventory": 10},
    {"id": 3, "title": "Charli XCX - Sucker CD", "price": 19.99, "inventory": 5}
]
const getProducts = (cb) => {
    setTimeout(() => cb(_products), 100)
}

const buyProducts = (products, cb, errorCb) => {
    setTimeout(() => {
        // simulate random checkout failure.
        (Math.random() > 0.5 || navigator.userAgent.indexOf('PhantomJS') > -1)
            ? cb()
            : errorCb()
    }, 100)
}

export default {
    getFormItem,
    campusEnrollCommit,
    getvideoLink,
    uploadVideo,
    getProducts,
    buyProducts
}