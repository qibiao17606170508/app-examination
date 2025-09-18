import store from '@/store'
import { MAPPING, QINIU_IMAGE_SERVER } from '@/utils/constant'
import * as qiniu from 'qiniu-js'
import { ElMessage } from 'element-plus'
import { uploadUrlApi } from '@/api/file/index'

/**
 * @description: 生成UUID
 * @param {*}
 * @return {*}
 * @author: qibiao
 */
export function generateUUID(): string {
  let result = ''
  const code = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  result = code.replace(/[xy]/gu, (item) => {
    const random = (Math.random() * 16) | 0
    const value = item === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
  })
  return result
}

/**
 * @description: 树形数据转换
 * @param {Array} data 树形数据数组
 * @param {String} key 键值
 * @param {String} parentKey 父级键值
 * @param {String} childrenKey 下级键值
 * @return {*}
 * @author: qibiao
 */
export function parseData2Tree(
  data: Array<any>,
  key: string = 'id',
  parentKey: string = 'parentId',
  childrenKey: string = 'children'
): Array<any> {
  const result: Array<any> = []
  const temp: { [key: string]: any } = {}
  for (let i = 0; i < data.length; i++) {
    temp[data[i][key]] = data[i]
  }
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][parentKey]] && data[k][key] !== data[k][parentKey]) {
      if (!temp[data[k][parentKey]][childrenKey]) {
        temp[data[k][parentKey]][childrenKey] = []
      }
      if (!temp[data[k][parentKey]]['_level']) {
        temp[data[k][parentKey]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][parentKey]]._level + 1
      temp[data[k][parentKey]][childrenKey].push(data[k])
    } else {
      result.push(data[k])
    }
  }
  return result
}

/**
 * @description: 日期转字符串
 * @param {Date} time 日期 默认当前日期
 * @param {String} format 格式
 * @return {*}
 * @author: qibiao
 */
export function parseDate2Str(
  time = new Date(),
  format = '{y}-{M}-{d} {h}:{m}:{s}'
): string {
  let result = ''
  let date = new Date()
  const type = typeof time
  if (type === 'object') {
    date = time
  } else if (type === 'number') {
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  result = format.replace(/\{[yMdhmsa]+\}/g, (val) => {
    const key = val.replace(/\{|\}/g, '') as keyof typeof formatObj
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return result
}
/**
 * @description: 字符串转日期
 * @param {String} time 日期字符串
 * @param {Array} separator 分隔符
 * @return {*}
 * @author: qibiao
 */
export function parseStr2Date(
  time: string = '',
  separator: string[] = ['-', ' ', ':']
): Date {
  let result = new Date()
  const regexp = new RegExp(`[${separator.join('')}]`, 'g')
  const data = time.split(regexp)
  switch (data.length) {
    case 3:
      result = new Date(+data[0], +data[1] - 1, +data[2])
      break
    case 6:
      result = new Date(
        +data[0],
        +data[1] - 1,
        +data[2],
        +data[3],
        +data[4],
        +data[5]
      )
      break
  }
  return result
}

/**
 * @description: 时间转时间戳
 * @param {Object} value 时间
 * @return {*}
 * @author: qibiao
 */
export function date2time(
  value: any,
  type: string = 's'
): number | string | number[] {
  const userAgent = navigator.userAgent
  if (!value) {
    return ''
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    (typeof value === 'object' &&
      value.toString().indexOf('中国') > -1 &&
      value.toString().indexOf(',') == -1) ||
    (typeof value === 'string' && value.toString().indexOf('中国') > -1) ||
    value.toString() === 'Invalid Date'
  ) {
    if (userAgent.indexOf('Safari') > -1) {
      value = value.toString().replace(/\-/g, '/')
    }
    const date = new Date(value)
    const result = type == 's' ? date.getTime() / 1000 : date.getTime()
    return result
  } else if (Array.isArray(value) && value.length > 0) {
    if (userAgent.indexOf('Safari') > -1) {
      value = value.map((dateItem: any) => {
        return dateItem.toString().replace(/\-/g, '/')
      })
    }
    const result = value.map((item: any) => {
      const date = new Date(item)
      return type == 's' ? date.getTime() / 1000 : date.getTime()
    })
    return result
  } else {
    return ''
  }
}
/**
 * @description: 数组转字符串
 * @param {Object} json json数据
 * @return {*}
 * @author: qibiao
 */
export function arr2str(json: any[]): string {
  if (json) {
    return json.join(',')
  } else {
    return ''
  }
}
/**
 * @description: json 转 param
 * @param {Object} json json数据
 * @return {*}
 * @author: qibiao
 */
export function parseJson2Param(json: { [key: string]: any }): string {
  return Object.keys(json)
    .map((key) => {
      if (!json[key]) return ''
      const temp = encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
      return temp
    })
    .join('&')
}

/**
 * @description: param 转 json
 * @param {String} url 链接
 * @return {*}
 * @author: qibiao
 */
export function parseParam2Json(url: string): { [key: string]: string } {
  const result: { [key: string]: string } = {}
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/gu, ' ')
  if (search) {
    const searchArr = search.split('&')
    searchArr.forEach((r) => {
      const index = r.indexOf('=')
      if (index !== -1) {
        const key = r.substring(0, index)
        const val = r.substring(index + 1, r.length)
        result[key] = val
      }
    })
  }
  return result
}

/**
 * @description: 置空json数据
 * @param {*} data json数据
 * @return {*}
 * @author: qibiao
 */
export function clearJson(data: { [key: string]: any }): void {
  for (const key in data) {
    if (data[key] instanceof Array) {
      data[key] = []
    } else if (
      typeof data[key] === 'object' &&
      Object.prototype.toString.call(data[key]).toLowerCase() ===
        '[object object]' &&
      !data[key].length
    ) {
      data[key] = {}
    } else {
      data[key] = ''
    }
  }
}

/**
 * @description: json 转 form
 * @param {*} data json数据
 * @return {*}
 * @author: qibiao
 */
export function obj2form(data: { [key: string]: any }): FormData {
  const result = new FormData()
  for (const key in data) {
    result.append(key, data[key])
  }
  return result
}

/**
 * @description: 判断是否有按钮级权限
 * @param {String} permission 多个使用 & 或 | 分隔开
 * @param {String} separator 分隔符：&-并且 |-或者
 * @return {*}
 * @author: qibiao
 */
export function havePermission(
  permission: string,
  separator: string = '&'
): boolean {
  const permissions = permission.split(separator)
  let fn: 'every' | 'some' = 'every'
  switch (separator) {
    case '&':
      fn = 'every'
      break
    case '|':
      fn = 'some'
      break
  }
  const list = store.getters['menu/permissions']
  return permissions[fn]((item) => {
    return list.indexOf(item) !== -1
  })
}

/**
 * @description: 获取Api BaseUrl
 * @param {*} key
 * @return {*}
 * @author: qibiao
 */
export function getApiBaseUrl(): string {
  return process.env.VUE_APP_PROXY === 'true'
    ? `/proxy${MAPPING}`
    : process.env.VUE_APP_BASE_API + MAPPING
}

/**
 * @description: 获取数据字典列表
 * @param {*} code 编码
 * @return {*}
 * @author: qibiao
 */
export async function getDictionaryList(code: string): Promise<any> {
  return await store.dispatch('dictionary/getDictionary', code)
}

/**
 * @description: 获取数据字典键值对
 * @param {*} key
 * @return {*}
 * @author: qibiao
 */
export async function getDictionaryMap(
  code: string
): Promise<{ [key: string]: string }> {
  const response = await store.dispatch('dictionary/getDictionary', code)
  const result: { [key: string]: string } = {}
  response.forEach((item: { value: string; label: string }) => {
    result[item.value] = item.label
  })
  return result
}

/**
 * @description: hex 转 rgb
 * @param {*} color 颜色
 * @return {*}
 * @author: qibiao
 */
export function hex2Rgb(color: string): number[] {
  color = color.replace('#', '')
  const result = color.match(/../g)!.map((hex) => parseInt(hex, 16))
  return result
}

/**
 * @description: rgb 转 hex
 * @param {*} r g b 颜色
 * @return {*}
 * @author: qibiao
 */
export function rgb2Hex(r: number, g: number, b: number): string {
  const hexs = [r.toString(16), g.toString(16), b.toString(16)]
  for (let i = 0; i < 3; i++) {
    if (hexs[i].length === 1) {
      hexs[i] = '0' + hexs[i]
    }
  }
  return '#' + hexs.join('')
}

/**
 * @description: 使颜色变淡
 * @param {*} key
 * @return {*}
 * @author: qibiao
 */
export function lighten(color: any, level: number): string {
  const rgb = hex2Rgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
  }
  return rgb2Hex(rgb[0], rgb[1], rgb[2])
}

/**
 * @description: 使颜色变深
 * @param {*} key
 * @return {*}
 * @author: qibiao
 */
export function darken(color: any, level: number): string {
  const rgb = hex2Rgb(color)
  for (let i = 0; i < 3; i++) {
    rgb[i] = Math.floor(rgb[i] * (1 - level))
  }
  return rgb2Hex(rgb[0], rgb[1], rgb[2])
}

/**
 * @description: 文件下载
 * @param {*} blob
 * @param {*} name 文件名称
 * @return {*}
 * @author: qibiao
 */
export function download(blob: Blob, name: string): void {
  if (blob) {
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = href
    a.download = name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(href)
  }
}
/**
 * @description: 遍历对象并取处对应的值和value
 * @return {*}
 * @author: qibiao
 */

export function getObj(obj: { [key: string]: any }): { [key: string]: any } {
  const result: { [key: string]: any } = {}
  for (const key in obj) {
    if (obj[key] instanceof Array) {
      result[key] = JSON.stringify(obj[key])
      result[key] = result[key].substring(1, result[key].length - 1)
    } else {
      result[key] = obj[key]
    }
  }
  return result
}
/**
 * @description: 获取uuid
 * @return {*}
 * @author: qibiao
 */
/**
 * 获取uuid
 * @param {Number} len 长度
 * @param {Number} radix 基数
 */
const uuid = (len: number = 32, radix: number = 16): string => {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid: string[] = []
  radix = radix || chars.length

  if (len) {
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
const getUploadFileName = (prefix: string, extension: string): string => {
  return `${prefix}/${uuid()}.${extension}`
}
/**
 * @description: 上传图片
 * @return {*}
 * @author: qibiao
 */
export function handleBeforeUploadFile(file: File): boolean {
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isLt5M) {
    ElMessage.error('文件不得大于5M')
  }
  return isLt5M
}
export function UploadImage(
  file: any,
  path: string = 'defaultImage',
  type: string = 'photo'
): Promise<any> {
  return new Promise((resolve, reject) => {
    var fileInfo
    if (file.file) {
      fileInfo = file.file
    } else {
      fileInfo = file
    }
    let formData = new FormData()
    formData.append('file', fileInfo)
    formData.append('type', type)
    uploadUrlApi(formData).then((res) => {
      if (res.code == 0) {
        resolve({
          url: res.data.ossurl,
        })
      } else {
        reject(res.message)
      }
    })
  })
}
/**
 * @description: 数组对象合并
 * @return {*}
 * @author: qibiao
 */
export function arrayObj(arr: any[], key: string): any[] {
  const getArr = JSON.parse(JSON.stringify(arr))
  return getArr.map((item: any) => {
    return Object.assign(item, item[key])
  })
}
/**
 * @description: 过滤方法
 * @return {*}
 * @author: qibiao
 */
export const filterFn = (item: any[], val: any): string => {
  if (typeof val == 'undefined' || val === null || val === '') {
    return '-'
  }
  return item.find((v) => v.value === val).label
}

/**
 * @description: 旋转图片
 * @return {*}
 * @author: qibiao
 */
export function rotateImage(url: string, angle: number = 1): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = url
    image.setAttribute('crossOrigin', 'anonymous')
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      let width = image.width
      let height = image.height
      if (angle > 1) {
        if (angle % 2 == 1) {
          canvas.width = height
          canvas.height = width
          ctx.translate(height / 2, width / 2)
          ctx.rotate((90 * angle * Math.PI) / 180)
          ctx.drawImage(image, -width / 2, -height / 2, width, height)
        } else {
          canvas.width = width
          canvas.height = height
          ctx.translate(width / 2, height / 2)
          ctx.rotate((90 * angle * Math.PI) / 180)
          ctx.drawImage(image, -width / 2, -height / 2, width, height)
        }
      } else {
        canvas.width = height
        canvas.height = width
        ctx.translate(height / 2, width / 2)
        ctx.rotate((90 * Math.PI) / 180)
        ctx.drawImage(image, -width / 2, -height / 2, width, height)
      }
      const dataURL = canvas.toDataURL('image/jpeg')
      const file = dataURLToFile(dataURL, 'rotate.jpg')
      resolve(file)
    }
  })
}
// 把BASE64图片转换为文件
export function dataURLToFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)![1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}
