/**
 * 二次封装函数
 * @module self
 */

import { urlGetQuery, urlChangeQuery } from "./url"
import { scrollTopOfBody } from "./scroll"
import { currency } from "./code"
import { encrptSHA1 } from "./encrypt"
import { formValidateAll } from "./form"
import { imgCompress, convertBase64ToBlob } from "./image"
import { getObjectURL, videoUploadGetPoster } from "./video"
import { jdIsWeixin, jdDownloadAppPlugInOpenApp, jdRiskControl } from "./jdsdk"
import $LAB from "./common"

const getSignature = params => {
    let timestamp=params.timestamp,
    noncestr=params.noncestr,
    url=`${location.protocol}//${location.host+location.pathname}`,
    str='jsapi_ticket='+this.jsapi_ticket+'&noncestr='+noncestr+'&timestamp='+timestamp+'&url='+url;
    console.log(str)
    return encrptSHA1(str);
}

export default {
    $LAB,
    scrollTopOfBody,
    formValidateAll,
    urlGetQuery,
    urlChangeQuery,
    imgCompress,
    convertBase64ToBlob,
    getObjectURL,
    videoUploadGetPoster,
    getSignature,
    jdIsWeixin,
    jdDownloadAppPlugInOpenApp,
    jdRiskControl,
    currency
}