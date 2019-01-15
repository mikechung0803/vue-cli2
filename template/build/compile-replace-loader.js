const fs = require('fs')
const path = require('path')
const loaderUtils = require('loader-utils')
const defaultOptions = {
  regExp: /\/\/router-async[\s\S]*\/\/router-async/,
  value: ''
}

module.exports = function (source) {
  this.cacheable && this.cacheable()
  // Handle options
  const loaderOptions = loaderUtils.getOptions(this) || {};
  const options = Object.assign(defaultOptions, loaderOptions)
  const { regExp, value } = options
  const regResult = regExp.exec(source)
  
  var callback = this.async()
  if (regResult) {
    const request = loaderUtils.urlToRequest(regResult[2])
    this.resolve('/', request, (err, rs) => {
      if (err) {
        rs = path.resolve(this.resourcePath, '../', request)
      }
      source = source.replace(regResult[0], value)
      callback(null, source)
    })
  } else if (regExp) {
    callback(null, source.replace(regExp, value))
  } else {
    callback(null, source)
  }
}