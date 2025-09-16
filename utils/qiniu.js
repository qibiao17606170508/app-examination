import config from '@/config/index.js'

//
/*
 *
 * 七牛云上传接口封装
 * @param {Number} count 限制上传张数 默认1
 * @param {Array} sourceType 从相册中选择 默认 从相册选择和相机
 * @param {Array} sizeType 指定图片类型 默认 原图、压缩图
 *
 */
export const upLoad = (count = 1, token, sourceType = ['album', 'camera'], sizeType = ['original', 'compressed']) => {
  return new Promise((resolve, reject) => {
    let urlArr = []
    uni.chooseImage({
      count: count,
      sizeType: sizeType,
      sourceType: sourceType,
      success: async (res) => {
        uni.showLoading({
          title: 'Loading...'
        })
        console.log('[ res ] >', res)
        for (let i = 0, len = res.tempFiles.length; i < len; i++) {
          // 命名
          const tmpcnt = res.tempFiles[i].name.lastIndexOf('.')
          // 后缀
          res.tempFiles[i].fileType = res.tempFiles[i].name.substring(tmpcnt + 1)
          // 文件名
          res.tempFiles[i].fileKey = getUploadFileName('h5/upload', res.tempFiles[i].fileType)
          await uni.uploadFile({
            url: 'https://upload.qiniup.com/',
            filePath: res.tempFiles[i]['path'],
            name: 'file',
            method: 'POST',
            formData: {
              key: res.tempFiles[i]['fileKey'],
              token: token //七牛云token值
            },
            success: (uploadFileRes) => {
              let strToObj = JSON.parse(uploadFileRes.data)
              let backUrl = config.QINIU_IMAGE_SERVER + strToObj.key
              console.log('[ res.tempFiles.length ] >', res.tempFiles.length)
              console.log('[ i ] >', i)
              urlArr.push(backUrl)
              if (res.tempFiles.length - 1 == i) {
                uni.hideLoading()
                resolve(urlArr)
              }
            },
            fail: (fail) => {
              uni.showToast({
                title: '网络错误',
                icon: 'none'
              })
              uni.hideLoading()
            }
          })
        }
      }
    })
  })
}
export const upLoadVideo = (
  count = 1,
  token,
  sourceType = ['album', 'camera'],
  sizeType = ['original', 'compressed']
) => {
  return new Promise((resolve, reject) => {
    let urlArr = []
    uni.chooseVideo({
      count: count,
      sizeType: sizeType,
      sourceType: sourceType,
      success: async (res) => {
        uni.showLoading({
          title: 'Loading...'
        })
        console.log('[ res ] >', res)
        // 命名
        const tmpcnt = res.tempFile.name.lastIndexOf('.')
        // 后缀
        res.tempFile.fileType = res.tempFile.name.substring(tmpcnt + 1)
        // 文件名
        res.tempFile.fileKey = getUploadFileName('h5/upload', res.tempFile.fileType)
        await uni.uploadFile({
          url: 'https://upload.qiniup.com/',
          filePath: res.tempFilePath,
          name: 'file',
          method: 'POST',
          formData: {
            key: res.tempFile['fileKey'],
            token: token //七牛云token值
          },
          success: (uploadFileRes) => {
            let strToObj = JSON.parse(uploadFileRes.data)
            let backUrl = config.QINIU_IMAGE_SERVER + strToObj.key
            uni.hideLoading()
            resolve(backUrl)
          },
          fail: (fail) => {
            uni.showToast({
              title: '网络错误',
              icon: 'none'
            })
            uni.hideLoading()
            reject(err)
          }
        })
      }
    })
  })
}
// 时间格式化
Date.prototype.format = function (mask) {
  var d = this
  var zeroize = function (value, length) {
    if (!length) {
      length = 2
    }
    value = String(value)
    for (var i = 0, zeros = ''; i < length - value.length; i++) {
      zeros += '0'
    }
    return zeros + value
  }
  return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function ($0) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const monthsAll = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    switch ($0) {
      case 'd':
        return d.getDate()
      case 'dd':
        return zeroize(d.getDate())
      case 'ddd':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()]
      case 'dddd':
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()]
      case 'M':
        return months[d.getMonth()]
      case 'MM':
        return zeroize(d.getMonth() + 1)
      case 'MMM':
        return months[d.getMonth()]
      case 'MMMM':
        return monthsAll[d.getMonth()]
      case 'yy':
        return String(d.getFullYear()).substr(2)
      case 'yyyy':
        return d.getFullYear()
      case 'h':
        return d.getHours() % 12 || 12
      case 'hh':
        return zeroize(d.getHours() % 12 || 12)
      case 'H':
        return d.getHours()
      case 'HH':
        return zeroize(d.getHours())
      case 'm':
        return d.getMinutes()
      case 'mm':
        return zeroize(d.getMinutes())
      case 's':
        return d.getSeconds()
      case 'ss':
        return zeroize(d.getSeconds())
      case 'l':
        return zeroize(d.getMilliseconds(), 3)
      case 'L':
        var m = d.getMilliseconds()
        if (m > 99) m = Math.round(m / 10)
        return zeroize(m)
      case 'tt':
        return d.getHours() < 12 ? 'am' : 'pm'
      case 'TT':
        return d.getHours() < 12 ? 'AM' : 'PM'
      case 'Z':
        return d.toUTCString().match(/[A-Z]+$/)
      // Return quoted strings with the surrounding quotes removed
      default:
        return $0.substr(1, $0.length - 2)
    }
  })
}
/*
 * upload/yyyy/MM/dd/uuid.{png,jpg,3pg}
 * @param {String} prefix 前缀
 * @param {String} extension 扩展名
 */
const getUploadFileName = (prefix, extension) => {
  const result = prefix + '/' + new Date().format('yyyy/MM/dd') + '/' + uuid() + '.' + extension
  return result
}

/**
 * 获取uuid
 * @param {Number} len 长度
 * @param {Number} radix 基数
 */

function uuid(len = 32, radix = 16) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []
  var i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data. At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
