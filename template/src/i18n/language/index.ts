/*
 * @Description:
 * @Autor: qibiao
 * @Email: qibiao0508@163.com
 * @Date: 2023-02-02 10:49:38
 * @LastEditors: Jack Qi
 * @LastEditTime: 2024-10-08 18:04:36
 */

/**
 * @description: // 把目录下所有js文件导入包括文件夹里的所有js 忽略掉index.js
 * @return {*}
 * @author: qibiao
 */

const files = require.context('.', true, /\.ts$/)
const modules: Record<string, any> = {}

files.keys().forEach((key: string) => {
  if (key === './index.js') return
  const name = key.replace(/(\.\/|\.ts)/g, '')
  modules[name] = files(key).default
})

/**
 * @description: // 处理引入的js的数据
 * @return {*}
 * @author: qibiao
 */

const messages: Record<string, Record<string, any>> = {}

Object.keys(modules).forEach((key: string) => {
  const keys = key.split('_')[0]
  const name = key.split('_')[1]
  const dirName = '/' + keys.replace(/(.*\/)*([^.]+).*/gi, '$2')
  const newKeys = keys.replace(dirName, '')
  if (!messages[name]) {
    messages[name] = {}
  }
  messages[name][newKeys] = modules[key]
})

export default {
  ...messages,
}
