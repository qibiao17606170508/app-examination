/*
 * @Description:
 * @Autor: Jack Qi
 * @Email: qibiao0508@163.com
 * @Date: 2024-10-08 14:49:16
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-09 10:10:44
 */
import { ElMessage } from 'element-plus'

const prompt = Symbol('prompt')

interface Options {
  type?: 'success' | 'warning' | 'info' | 'error' // 修改类型
  message: string
  duration?: number
  // 其他可能的选项...
}

export default class Prompt {
  success(options: Options, single: boolean = true): void {
    options.type = 'success'
    this[prompt](options, single)
  }

  warning(options: Options, single: boolean = true): void {
    options.type = 'warning'
    this[prompt](options, single)
  }

  info(options: Options, single: boolean = true): void {
    options.type = 'info'
    this[prompt](options, single)
  }

  error(options: Options, single: boolean = true): void {
    options.type = 'error'
    this[prompt](options, single)
  }

  [prompt](options: Options, single: boolean): void {
    if (single) {
      if (document.getElementsByClassName('el-message').length === 0) {
        ElMessage(options)
        return
      }
      const elements = document.getElementsByClassName('el-message')
      if (elements.length) {
        let flag = false
        for (let index = 0; index < elements.length; index++) {
          const element = elements[index] as HTMLElement
          if (
            element.style.display !== 'none' &&
            element.style.display !== ''
          ) {
            flag = true
          }
        }
        if (flag) {
          ElMessage(options)
        }
      }
    } else {
      ElMessage(options)
    }
  }
}
