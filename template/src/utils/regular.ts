/**
 * @description: 整数
 * @param {string | number} input
 * @return {boolean}
 */
export function isInteger(input: string | number): boolean {
  const reg = /^-?[1-9]\d*$/
  return reg.test(input.toString())
}

/**
 * @description: 正整数
 * @param {string | number} input
 * @return {boolean}
 */
export function isPositiveInteger(input: string | number): boolean {
  const reg = /^[1-9]\d*$/
  return reg.test(input.toString())
}

/**
 * @description: 负整数
 * @param {string | number} input
 * @return {boolean}
 */
export function isNegtiveInteger(input: string | number): boolean {
  const reg = /^-[1-9]\d*$/
  return reg.test(input.toString())
}

/**
 * @description: 邮箱
 * @param {string} input
 * @return {boolean}
 */
export function isEmail(input: string): boolean {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  return reg.test(input)
}

/**
 * @description: URL地址
 * @param {string} input
 * @return {boolean}
 */
export function isURL(input: string): boolean {
  const reg = /^http[s]?:\/\/.*/
  return reg.test(input)
}

/**
 * @description: 端口
 * @param {string | number} input
 * @return {boolean}
 */
export function isPort(input: string | number): boolean {
  const reg =
    /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
  return reg.test(input.toString())
}

/**
 * 手机号码
 * @param {string} input
 * @return {boolean}
 */
export function isMobile(input: string): boolean {
  const reg = /^1[0-9]{10}$/
  return reg.test(input)
}

/**
 * 用户名
 * @param {string} input
 * @return {boolean}
 */
export function isUsername(input: string): boolean {
  const reg = /^[a-zA-Z0-9_-]{4,16}$/
  return reg.test(input)
}

/**
 * 密码
 * @param {string} input
 * @return {boolean}
 */
export function isPassword(input: string): boolean {
  const reg = /^[a-zA-Z0-9_-]{8,16}$/
  return reg.test(input)
}

/**
 * json 字符串
 * @param {string} input
 * @return {boolean}
 */
export function isJson(input: string): boolean {
  if (typeof input === 'string') {
    try {
      const obj = JSON.parse(input)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
  return false
}
