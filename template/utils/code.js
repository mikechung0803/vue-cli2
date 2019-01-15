/**
 * 关于包含数字字母等字符类的处理
 * @author zhongxianyu
 * @module code
 */

/**
 * @author zhongxianyu
 * @description 随机生成某个位数的大小写字母和数字组合，且每位随机搭配颜色和字号
 * @param {Number} length 输出的随机码位数
 * @returns {Object} 包含code、arr、str，code为随机数，arr为对象数组，对象里包含每位数几对应的随机颜色和随机字号，str为拼接好的html片段
 */
function codeRandom(length){
    // 所需随机抽取的样本数组 
    let nums=new Array("q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m","A","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M","0","1","2","3","4","5","6","7","8","9");
    // 初始化 拼接字符串
    let code="",arr=[],str="";
    //颜色需要的数组元素
    let nums1=new Array("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f");
    let n1="";
    //字号需要的数组元素
    let nums2=new Array("1","2","3","4","5","6","7");
    let n2;
    for(let i=0;i<length;i++){
    //遍历拼接颜色色值 eg 000000
        for(let j=0;j<6;j++){
            let k=Math.floor(Math.random()*100)%16;
              n1=n1+nums1[k];
        }
        //每次生成一个随机的字号
        let o=Math.floor(Math.random()*100)%8;
               n2=nums2[o];       
        //每次生成一个0 - 61 之间的 number 作为随机获取验证码的下标
        let p=nums[Math.floor(Math.random()*1000)%62];
        // p=nums[Math.ceil(Math.random()*61)];
        code += p;
        arr.push({code: p, color: n1, size: n2});
        //拼接验证码  随机颜色 随机字号 随机抽取大小写字母和数字
        str+="<font color='#"+n1+"' size='"+n2+"'>"+p+"</font>"
    }
    return {
        code: code,
        arr: arr,
        str: str
    }
}

/**
 * @author zhongxianyu
 * @description 阿拉伯数字按照每3个数字加逗号
 * @param {Number} num 阿拉伯数字
 * @returns {String} 阿拉伯数字按照每3个数字加逗号
 */
const numberAddComma = (num = 0) => {
    num = parseInt(num);
    let numStr = num + "",
        numArr = numStr.split(''),
        commaCount = parseInt((numArr.length - 1) / 3),
        numArrOriginLen = numArr.length;
    for (let i = 1; i <= commaCount; i++) {
        let index = numArrOriginLen - i * 3;
        numArr.splice(index, 0, ",");
    }
    return numArr.join('');
}

const currency = (value, currency, decimals) => {
    const digitsRE = /(\d{3})(?=\d)/g
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '$'
    decimals = decimals != null ? decimals : 2
    var stringified = Math.abs(value).toFixed(decimals)
    var _int = decimals
        ? stringified.slice(0, -1 - decimals)
        : stringified
    var i = _int.length % 3
    var head = i > 0
        ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
        : ''
    var _float = decimals
        ? stringified.slice(-1 - decimals)
        : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head +
        _int.slice(i).replace(digitsRE, '$1,') +
        _float
}

/**
 * @author zhongxianyu
 * @description 单位为万亿，其它仍为数字，常用票数展示避免数字过长影响样式
 * @param {Number} num 需要转换的数字
 * @param {Number} digit 选填，有效数字保留位数，默认为1位
 * @returns {String} 单位为万亿，其它仍为数字
 */
const numberToChinseUnit = (num, digit) => {
    function strNumSize(tempNum) {
        let stringNum = tempNum.toString();
        let index = stringNum.indexOf(".");
        let newNum = stringNum;
        if(index != -1) {
            newNum = stringNum.substring(0, index)
        };
        return newNum.length;
    }
    if(!num) return 0;
    num = parseInt(num);
    if (num <= 9999) {
        return num;
    }
    let moneyUnits = ["", "万", "亿", "万亿"],
        dividend = 10000,
        curentNum = num,
        curentUnit = moneyUnits[0]; // 转换数字

    // 转换单位 
    for(let i = 0; i < 4; i++) {
        curentUnit = moneyUnits[i];
        if(strNumSize(curentNum) < 5) {
            break;
        };
        curentNum = curentNum / dividend;
    };
    let m = {
        num: 0,
        unit: ""
    };
    m.num = curentNum.toFixed(parseInt(digit) || 1);
    m.unit = curentUnit;
    return m.num+m.unit;
}

/**
 * @author zhongxianyu
 * @description 阿拉伯数字转中文数字
 * @param num 阿拉伯数字
 * @returns {String} 中文数字
 */
const numberToChinese = (num = 0) => {
    let chnNumChar = ["零","一","二","三","四","五","六","七","八","九"],
        chnUnitSection = ["","万","亿","万亿","亿亿"],
        chnUnitChar = ["","十","百","千"],
        unitPos = 0,
        strIns = '',
        chnStr = '',
        needZero = false,
        sectionToChinese = (section) => {
            let strIns = '', chnStr = '';
            let unitPos = 0;
            let zero = true;
            while(section > 0){
                let v = section % 10;
                if(v === 0){
                    if(!zero){
                    zero = true;
                    chnStr = chnNumChar[v] + chnStr;
                    }
                }else{
                    zero = false;
                    strIns = chnNumChar[v];
                    strIns += chnUnitChar[unitPos];
                    chnStr = strIns + chnStr;
                }
                unitPos++;
                section = Math.floor(section / 10);
            }
            return chnStr;
        };

    if(num === 0){
        return chnNumChar[0];
    }
   
    while(num > 0){
        var section = num % 10000;
        if(needZero){
            chnStr = chnNumChar[0] + chnStr;
        }
        strIns = sectionToChinese(section);
        strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
        chnStr = strIns + chnStr;
        needZero = (section < 1000) && (section > 0);
        num = Math.floor(num / 10000);
        unitPos++;
    }
    if(chnStr == '一十') chnStr = '十';
    return chnStr;
}

/**
 * @author zhongxianyu
 * @description 中文数字转换成阿拉伯数字
 * @param {String} chnStr 中文数字
 * @returns {Number} 阿拉伯数字
 */
const chineseToNumber = (chnStr) => {
    let rtn = 0,
        section = 0,
        number = 0,
        secUnit = false,
        str = chnStr.split(''),
        chnNumChar = {
            零: 0,
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
            九: 9
        },
        chnNameValue = {
            十:{value:10, secUnit:false},
            百:{value:100, secUnit:false},
            千:{value:1000, secUnit:false},
            万:{value:10000, secUnit:true},
            亿:{value:100000000, secUnit:true}
        };
   
    for(let i = 0; i < str.length; i++){
        let num = chnNumChar[str[i]];
        if(typeof num !== 'undefined'){
            number = num;
            if(i === str.length - 1){
                section += number;
            }
        }else{
            let unit = chnNameValue[str[i]].value;
            secUnit = chnNameValue[str[i]].secUnit;
            if(secUnit){
                section = (section + number) * unit;
                rtn += section;
                section = 0;
            }else{
                section += (number * unit);
            }
            number = 0;
        }
    }
    return rtn + section;
}

/**
 * @description 剔除数组的空内容
 * @author zhongxianyu
 * @param {Array} arr 数组
 * @returns {Array} 剔除空内容的数组
 */
const arrayNullRemove = (arr = []) => {
    for(var i = 0;i<arr.length;i++){
        if(arr[i]==''||arr[i]==null||typeof(arr[i])==undefined){
            arr.splice(i,1);
            i=i-1;
        }
    }
    return arr;
}

export {
    codeRandom,
    numberAddComma,
    currency,
    numberToChinese,
    chineseToNumber,
    numberToChinseUnit,
    arrayNullRemove
}