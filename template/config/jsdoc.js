/**
 * jsdoc 配置文件
 */
module.exports = {
    "plugins": ["node_modules/jsdoc-vue"],
    "source": {
        "includePattern": "\\.(js)$"
    },
    "opts": {
        // 文档输出路径
        "destination": "./jsdoc",
        "encoding": "utf8",
        "private": true,
        "recurse": true,
        // 使用模板 minami
        // "template": "./node_modules/minami"
    }
}